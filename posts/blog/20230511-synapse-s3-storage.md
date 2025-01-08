---
layout: blog.html
title: "S3 Media Storage For Matrix Synapse"
date: 2023-05-11
---

I noticed recently on my Matrix Synapse homeserver that my storage was starting to get a little bit full. I hadn't considered it in the past since the server sees very little use, but I decided the best way to solve the issue would be to move my media storage onto an S3-compatible service.

Unfortunately, I overestimated the number of useful resources that would exist to help me configure that, and underestimated how difficult it would be. Here's a quick rundown of what I learned after a full day of hair pulling and how to set things up for your own server.
<!-- more -->

## How Stuff Works

There is no built-in S3 storage capability in Synapse; instead you need to install an [extra module](https://github.com/matrix-org/synapse-s3-storage-provider) to get it to work. Said module is barely documented with no clear install instructions available anywhere on the Internet as far as I can tell.

If you followed [the instructions in the Synapse documentation](https://matrix-org.github.io/synapse/latest/setup/installation.html) you probably didn't think too hard about what was actually happening behind the scenes. What actually happens is that a virtual environment is created in `/opt/venvs/matrix-synapse`, meaning we can `source /opt/venvs/matrix-synapse/bin/activate` to install and manipulate packages.

Digging through the comments of [one GitHub issue](https://github.com/matrix-org/synapse-s3-storage-provider/issues/14#issuecomment-847146994) does inform us that we can just install the S3 module via pip. That handles making sure that `s3_storage_provider.py` is in a place that Synapse can access it.

## Making Connections

The only thing that *is* properly documented about this module is [how to configure Synapse to use it.](https://github.com/matrix-org/synapse-s3-storage-provider#usage) You'll probably want to create a file in `/etc/matrix-synapse/conf.d/` named something like `storage.yaml` to store your configuration.

```yaml
media_storage_providers:
- module: s3_storage_provider.S3StorageProviderBackend
  store_local: True
  store_remote: True
  store_synchronous: True
  config:
    bucket: <S3 bucket name>
    region_name: <S3 region>
    endpoint_url: <S3 endpoint URI>
    access_key_id: <S3 access key ID>
    secret_access_key: <S3 access key>
```

## 10 Second Tidy

Synapse doesn't really use S3 for storage in the way you might expect it does. Rather, it holds files there until they are needed, at which point they are copied to the standard media store on the local file system. It also doesn't have an mechanism to automatically cleanup the local media store. While it does have scripts to upload files to S3 and delete local files, automating that task is going to be your responsibility. You'll almost certainly want to write a bash script to handle this.

```bash
#!/bin/bash

export AWS_ACCESS_KEY_ID=<S3 access key ID>
export AWS_SECRET_ACCESS_KEY=<S3 access key>
export AWS_DEFAULT_REGION=<S3 region>

/opt/venvs/matrix-synapse/bin/s3_media_upload update /var/lib/matrix-synapse/media 7d
/opt/venvs/matrix-synapse/bin/s3_media_upload upload /var/lib/matrix-synapse/media <S3 bucket name> --delete --endpoint-url <S3 endpoint URI>
```

Yet another thing that isn't documented is passing the S3 credentials to the script. You'll need to do it through environment variables, which is why we define those in the script.

Next, the script enumerates which media needs to be deleted from the local media store. The `7d` can be updated to a different length of time if you want to retain more or less media locally.

Finally, the script uploads any missing files to the S3 bucket and deletes unneeded local files. The `--endpoint-url` flag is, yet again, undocumented, but that's how you define a storage provider other than AWS. If your media store is set somewhere other than the default path (`/var/lib/matrix-synapse/media`) make sure you update your script to accommodate that.

Alongside your script, you'll need a `database.yaml` file with the credentials to your Synapse server's Postgres instance. To the surprise of no one, the format for this file is undocumented.

```yaml
user: synapse_user
password: <password>
database: synapse
host: localhost
port: 5432
```

If your username or database name are different, make sure to update those in the file. Now you can either run the script manually or, more likely, set your server to run the script periodically using something like a cron job.
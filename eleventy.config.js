const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const rssFeed = require("@11ty/eleventy-plugin-rss");
const embeds = require("eleventy-plugin-embed-everything");
const markdownIt = require("markdown-it");
const mdIterator = require('markdown-it-for-inline');
const {stripHtml} = require("string-strip-html");
const {encode} = require("html-entities");
const {DateTime} = require("luxon");
const crypto = require("crypto");

module.exports = async function(eleventyConfig) {
	const { EleventyHtmlBasePlugin } = await import("@11ty/eleventy");

	const md = new markdownIt({
		html: true,
	});

	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPlugin(rssFeed);
	eleventyConfig.addPlugin(embeds);

	eleventyConfig.addPassthroughCopy("img");
	eleventyConfig.addPassthroughCopy("styles");
	eleventyConfig.addPassthroughCopy("scripts");
	eleventyConfig.addPassthroughCopy("favicon.ico");
	eleventyConfig.addPassthroughCopy("robots.txt");

	eleventyConfig.setLibrary("md", md);

	eleventyConfig.amendLibrary("md", (mdLib) => {
		mdLib.renderer.rules.table_open = function(tokens, idx) {
			return `<table class="table table-striped" data-bs-theme="dark">`;
		};
		mdLib.renderer.rules.blockquote_open = function(tokens, idx) {
			return `<blockquote class="blockquote">`;
		};

		mdLib.use(mdIterator, "url_new_win", "link_open", function (tokens, idx) {
			const [attrName, href] = tokens[idx].attrs.find(attr => attr[0] === 'href');
			if (href && (!href.includes('jacen.moe') && !href.startsWith('/') && !href.startsWith('#'))) {
				tokens[idx].attrPush([ 'target', '_blank' ]);
				tokens[idx].attrPush([ 'rel', 'noopener noreferrer' ]);
    	}
		});
	});

  eleventyConfig.setFrontMatterParsingOptions({
		excerpt: true,
		excerpt_separator: "<!-- more -->",
	});

	eleventyConfig.addPairedShortcode("spoiler", (content) => {
		return `<div class="alert alert-warning" data-bs-theme="dark"><p class="h4 alert-heading mb-0"><b>${content}</b></p></div>`;
	});

	eleventyConfig.addPairedShortcode("chatbox", (content) => {
		return `<div class="border border-light rounded-3 p-4 chat-container mx-auto">
			${content}
		</div>`;
	});

	eleventyConfig.addPairedShortcode("chatmsg", (content, speaker, role) => {
		const hash = crypto.createHash("md5").update(`${speaker}-${content}`).digest("hex").substring(0, 8);

		const messageId = `msg-${speaker.toLowerCase().replace(/\s+/g, '-')}-${hash}`;

		return `<div class="d-flex justify-content-${role === "rec" ? "start" : "end"} mb-2">
			<div class="rounded-3 p-3 chat-${role} aria-label="Message from ${speaker}"">
				<small class="fw-bold" id="${messageId}">${speaker}</small>
				<div class="mb-1" aria-labelledby="${messageId}">${md.render(content)}</div>
			</div>
		</div>`;
	});

	eleventyConfig.addFilter("markdown", (content) => {
		if (!content) return "";
		return md.render(content).replace(/<img .*>/g, "").replace(/{% .* %}(.*){% end.* %}/g, "<b>$1</b>");
	});

	eleventyConfig.addFilter("formatExcerpt", (content) => {
		if (!content) return "";
		return encode(stripHtml(md.render(content).replace(/{% .* %}(.*){% end.* %}/g, "$1")).result);
	});

	eleventyConfig.addFilter("rssSummary", (content) => {
		if (!content) return "";
		return md.render(content).replace(/<p[^>]*>[\s]*<img [^>]*>[\s]*<\/p>/g, "").replace(/{% .* %}(.*){% end.* %}/g, "<b>$1</b>");
	});

	eleventyConfig.addFilter("postType", (tags) => {
		try {
			if (tags.includes("rant")) return "Rant";
			if (tags.includes("blog")) return "Blog";
			return "Post";
		} catch {
			return "Post";
		}
	});

	eleventyConfig.addFilter("stripNewlines", (content) => {
		if (!content) return "";
		return content.replace(/[\r\n]+/g, ' ');
	});

	eleventyConfig.addFilter("toLocalTime", (date) => {
		return DateTime.fromJSDate(date, {zone: "UTC"}).toLocaleString(DateTime.DATE_FULL);
	});

	eleventyConfig.addFilter("toFeedTime", (date) => {
		return DateTime.fromJSDate(date, {zone: "UTC"}).plus({ hours: 5 }).toISO();
	});

	eleventyConfig.addFilter("toUTC", (date) => {
		return date.toUTCString();
	});

	eleventyConfig.addFilter("shipSort", (ships) => {
		ships.sort( (a, b) => {
			if (a.data.franchise == b.data.franchise) {
				return a.data.title.localeCompare(b.data.title);
			}
			return a.data.franchise.localeCompare(b.data.franchise);
		});
		return ships;
	});

	eleventyConfig.addLiquidFilter("dateToRfc3339", rssFeed.dateToRfc3339);

	eleventyConfig.addLiquidFilter("getNewestCollectionItemDate", rssFeed.getNewestCollectionItemDate);
};
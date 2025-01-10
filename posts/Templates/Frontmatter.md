<%* const postType = await tp.system.suggester(["Blog Post", "Rant", "Ship Analysis"], ["blog", "rant", "ship"]); -%>
---
layout: <% postType %>.html
title: ""
date: <% tp.date.now() %>
<%* if (postType == "ship") { -%>
franchise: ""
problematic: false
<%* } -%>
---

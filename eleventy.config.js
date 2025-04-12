const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const rssFeed = require("@11ty/eleventy-plugin-rss");
const embeds = require("eleventy-plugin-embed-everything");
const markdownIt = require("markdown-it");
const {stripHtml} = require("string-strip-html");
const {encode} = require("html-entities");
const {DateTime} = require("luxon");

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
	eleventyConfig.addPassthroughCopy("favicon.ico");
	eleventyConfig.addPassthroughCopy("robots.txt");

	eleventyConfig.amendLibrary("md", (mdLib) => {
		mdLib.renderer.rules.table_open = function(tokens, idx) {
			return `<table class="table table-striped" data-bs-theme="dark">`;
		};
		mdLib.renderer.rules.blockquote_open = function(tokens, idx) {
			return `<blockquote class="blockquote">`;
		};
	});

  eleventyConfig.setFrontMatterParsingOptions({
		excerpt: true,
		excerpt_separator: "<!-- more -->",
	});

	eleventyConfig.addPairedShortcode("spoiler", (content) => {
		return `<div class="alert alert-warning" data-bs-theme="dark"><p class="h4 alert-heading mb-0"><b>${content}</b></p></div>`;
	});

	eleventyConfig.addFilter("markdown", (content) => {
		return md.render(content).replace(/<img .*>/g, "").replace(/{% .* %}(.*){% end.* %}/g, "<b>$1</b>");
	});

	eleventyConfig.addFilter("formatExcerpt", (content) => {
		return encode(stripHtml(md.render(content).replace(/{% .* %}(.*){% end.* %}/g, "$1")).result);
	});

	eleventyConfig.addFilter("stripNewlines", (content) => {
		return content.replace(/[\r\n]+/g, ' ');
	});

	eleventyConfig.addFilter("toLocalTime", (date) => {
		return DateTime.fromJSDate(date, {zone: "UTC"}).toLocaleString(DateTime.DATE_FULL);
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
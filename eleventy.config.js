const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const {DateTime} = require("luxon");

module.exports = function(eleventyConfig) {
	const md = new markdownIt({
		html: true,
	});

  eleventyConfig.addPlugin(syntaxHighlight);

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

	eleventyConfig.addFilter("markdown", (content) => {
		return md.render(content).replace(/<img .*>/g, "");
	});

	eleventyConfig.addFilter("toLocalTime", (date) => {
		return DateTime.fromJSDate(date, {zone: "UTC"}).toLocaleString(DateTime.DATE_FULL);
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
};
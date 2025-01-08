const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
	const md = new markdownIt({
		html: true,
	});

  eleventyConfig.addPlugin(syntaxHighlight);

	eleventyConfig.addPassthroughCopy("img");
	eleventyConfig.addPassthroughCopy("styles");
	eleventyConfig.addPassthroughCopy("favicon.ico");
	eleventyConfig.addPassthroughCopy("robots.txt");

  eleventyConfig.setFrontMatterParsingOptions({
		excerpt: true,
		excerpt_separator: "<!-- more -->",
	});

	eleventyConfig.addFilter("markdown", (content) => {
		return md.render(content).replace(/<img .*>/g, "");
	});
};
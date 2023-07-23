module.exports = function (eleventyConfig) {

  eleventyConfig.addPassthroughCopy('build/historical/*.css');
  eleventyConfig.addPassthroughCopy('build/packaged/css/*.css');
  eleventyConfig.addPassthroughCopy('build/packaged/javascript/semantic.js');
  eleventyConfig.addPassthroughCopy('static/images');
  eleventyConfig.addPassthroughCopy('static/stylesheets');

  return {
    templateFormats: ['md', 'njk', 'html'],
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true
  }
}
module.exports = (eleventyConfig) => {
  // Copy different directories and files 
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("keybase.txt");

  return {
    passthroughFileCopy: true
  };
};
const getStyles = require('./functions/styles');
const getLastFMArtists = require('./functions/lastfm');

module.exports = (eleventyConfig) => {
  // Copy different directories and files 
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("keybase.txt");
  eleventyConfig.addPassthroughCopy("manifest.json");

  eleventyConfig.addJavaScriptFunction("getStyles", getStyles);

  eleventyConfig.addShortcode("latestLastFmArtists", async function() {
    const artists = await getLastFMArtists();

    if (!artists || artists.length === 0) {
      return '';
    }

    return ` I've been listening to ${artists}.`;
  });

  return {
    passthroughFileCopy: true
  };
};
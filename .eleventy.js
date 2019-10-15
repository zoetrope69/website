const getStyles = require('./functions/styles');
const getLastFMArtists = require('./functions/lastfm');
const getLatestLetterboxDiaryEntry = require('./functions/letterboxd');

module.exports = (eleventyConfig) => {
  // Copy different directories and files 
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("keybase.txt");
  eleventyConfig.addPassthroughCopy("manifest.json");

  eleventyConfig.addJavaScriptFunction("getStyles", getStyles);
  eleventyConfig.addJavaScriptFunction("getUTCDateTime", () => {
    return new Date().toLocaleString('en-GB', { timeZone: 'UTC' })
  });
  eleventyConfig.addShortcode("latestLastFmArtists", async function() {
    const artists = await getLastFMArtists();

    if (!artists || artists.length === 0) {
      return '';
    }

    return ` I've been listening to ${artists}.`;
  });
  eleventyConfig.addShortcode("latestLetterboxdFilm", async function() {
    const letterboxdDiaryEntry = await getLatestLetterboxDiaryEntry();

    if (!letterboxdDiaryEntry) {
      return '';
    }

    const { film, rating, uri } = letterboxdDiaryEntry;

    const lastFilmString = `The last film I watched was ${film.title}`;
    const ratingString = `<a href="${uri}">I rated it <span aria-label="${rating.score}/5 stars">${rating.text}</span></a>`;

    return ` ${lastFilmString}, ${ratingString}.`;
  });

  return {
    passthroughFileCopy: true
  };
};
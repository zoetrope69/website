const getStyles = require("./functions/styles");
const getLastFMArtists = require("./functions/lastfm");
const getLatestLetterboxDiaryEntry = require("./functions/letterboxd");
const getLatestSongkickGig = require("./functions/songkick");

module.exports = (eleventyConfig) => {
  // Copy different directories and files
  eleventyConfig.addPassthroughCopy("downloads");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("manifest.json");

  eleventyConfig.addJavaScriptFunction("getStyles", getStyles);
  eleventyConfig.addJavaScriptFunction("getUTCDateTime", () => {
    return new Date().toLocaleString("en-GB", { timeZone: "UTC" });
  });
  eleventyConfig.addShortcode("latestLastFmArtists", async function () {
    const artists = await getLastFMArtists();

    if (!artists || artists.length === 0) {
      return "";
    }

    return ` I've been listening to ${artists}.`;
  });
  eleventyConfig.addShortcode("latestLetterboxdFilm", async function () {
    const letterboxdDiaryEntry = await getLatestLetterboxDiaryEntry();

    if (!letterboxdDiaryEntry) {
      return "";
    }

    const { film, rating, uri, isRewatch } = letterboxdDiaryEntry;

    const watchedString = isRewatch ? "rewatched" : "watched";
    const lastFilmString = `The last film I ${watchedString} was ${film.title}`;
    const ratingString = `<a href="${uri}">I rated it <span aria-label="${rating.score}/5 stars">${rating.text}</span></a>`;

    return ` ${lastFilmString}, ${ratingString} <span aria-hidden="true">🝿🤔</span>.`;
  });
  eleventyConfig.addShortcode("latestSongkickGig", async function () {
    const songkickGig = await getLatestSongkickGig();

    if (!songkickGig) {
      return "";
    }

    const { name, uri } = songkickGig;

    return ` The last gig I went to was <a href="${uri}">${name}</a> <span aria-hidden="true">🎫</span>.`;
  });

  return {
    passthroughFileCopy: true,
  };
};

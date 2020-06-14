const letterboxd = require("letterboxd");

const LETTERBOXD_USERNAME = "zaccolley";

async function getLatestLetterboxDiaryEntry() {
  return new Promise((resolve) => {
    letterboxd(LETTERBOXD_USERNAME)
      .then((items) => {
        if (!items || items.length == 0) {
          return resolve();
        }

        resolve(items[0]);
      })
      .catch((error) => {
        console.error(`Letterboxd error: ${error}`);
        resolve();
      });
  });
}

module.exports = getLatestLetterboxDiaryEntry;

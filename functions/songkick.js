require("dotenv").config();

if (!process.env.SONGKICK_API_KEY) {
  console.error(
    "❗ Failed to load in the SONGKICK_API_KEY. Is it missing from the `.env` file?"
  );
  process.exit();
}

// https://github.com/node-fetch/node-fetch/blob/main/docs/v3-UPGRADE-GUIDE.md#converted-to-es-module
const fetch = (...args) => {
  return import("node-fetch").then(({ default: fetch }) => fetch(...args));
};

const { SONGKICK_API_KEY } = process.env;
const SONGKICK_API_URI = "https://api.songkick.com/api/3.0/users";
const SONGKICK_USERNAME = "zaccolley";

function getLatestSongkickGig() {
  return new Promise((resolve) => {
    fetch(
      `${SONGKICK_API_URI}/${SONGKICK_USERNAME}/gigography.json?apikey=${SONGKICK_API_KEY}&order=desc`
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.resultsPage.error) {
          console.error(
            `Songkick error: ${response.resultsPage.error.message}`
          );
          return resolve();
        }

        const [firstEvent] = response.resultsPage.results.event;
        const { displayName, uri } = firstEvent;
        const [uriWithNoParams] = uri.split("?");

        const gig = {
          name: displayName,
          uri: uriWithNoParams,
        };

        resolve(gig);
      })
      .catch((reason) => {
        console.error(reason);
        resolve();
      });
  });
}

module.exports = getLatestSongkickGig;

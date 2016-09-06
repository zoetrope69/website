'use strict';
require('dotenv').load(); // bring in enviroment vars

var letterboxd = require('letterboxd');

const getFilms = new Promise((resolve, reject) => {
  letterboxd(process.env.LETTERBOXD_USERNAME, (error, films) => {
    if (error) {
      return resolve(error);
    }

    if (films.length <= 0) {
      return resolve(`Error: No films`);
    }

    // convert times to stuff we can work with
    films = films.map(item => {
      const dateWatched = new Date(item.date.watched);
      item.date.watched = {
        human: dateWatched.toDateString(),
        iso: dateWatched.toISOString()
      };

      const datePublished = new Date(item.date.published);
      item.date.published = {
        human: datePublished.toDateString(),
        iso: datePublished.toISOString()
      };

      return item;
    });

    resolve(films);
  });
});

module.exports = getFilms;

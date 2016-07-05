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

    resolve(films);
  });
});

module.exports = getFilms;

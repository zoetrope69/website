'use strict';
require('dotenv').load(); // bring in enviroment vars

var letterboxd = require('letterboxd');

function getFilms() {
  return new Promise(resolve => {
    return letterboxd(process.env.LETTERBOXD_USERNAME)
      .then(films => films.filter(film => film.type === 'diary'))
      .then(films => {
        if (films.length <= 0) {
          return resolve({ error: 'No films' });
        }

        // convert times to stuff we can work with
        films = films.map(item => {
          const dateWatched = new Date(item.date.watched);
          const datePublished = new Date(item.date.published);

          delete item.date;

          item.time = {
            watched: {
              human: dateWatched.toDateString(),
              iso: dateWatched.toISOString()
            },
            published: {
              human: `${datePublished.toDateString()} ${datePublished.toLocaleTimeString('en-GB')}`,
              iso: datePublished.toISOString()
            }
          };

          return item;
        });

        resolve(films);
      })
      .catch(error => resolve({ error }));
  });
}

module.exports = getFilms;

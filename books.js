'use strict';
require('dotenv').load(); // bring in enviroment vars

const request = require('request');
const parser = require('xml2json');

const uri = 'https://www.goodreads.com/review/list/' +
            process.env.GOODREADS_USERNAME + '.xml' +
            '?key=' + process.env.GOODREADS_API +
            '&v=2&per_page=200';

function handleShelf(shelf) {
  // if the shelf is an array there's more than one shelf
  if (Array.isArray(shelf)) {
    shelf = shelf[0]; // pick the first shelf
  }

  return shelf.name; // just get the name of the shelf
}

const getBooks = new Promise((resolve, reject) => {
  request(uri, (error, response, body) => {
    if (error) {
      return reject(error);
    }

    if (response.statusCode !== 200) {
      return reject(`Error: Response was not OK`);
    }

    const result = parser.toJson(body, { object: true });
    const reviews = result.GoodreadsResponse.reviews.review;

    let books = reviews.map(review => {
      const book = review.book;

      const date = new Date(review.date_updated);
      const output = {
        time: {
          human: date.toDateString(),
          iso: date.toISOString()
        },
        id: book.id.$t,
        shelf: handleShelf(review.shelves.shelf),
        title: book.title,
        uri: book.link,
        image: book.small_image_url
      };

      // check if there's an image and add if there is
      // no photo is in the url if there is no image
      if (book.small_image_url.indexOf('/nophoto/') <= -1) {
        output.image = book.small_image_url;
      }

      return output;
    });

    resolve(books);
  });
});

module.exports = getBooks;

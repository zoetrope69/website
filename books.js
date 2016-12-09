'use strict'
require('dotenv').load() // bring in enviroment vars

const request = require('request')
const parser = require('xml2json')

const uri = 'https://www.goodreads.com/review/list/' +
            process.env.GOODREADS_USERNAME + '.xml' +
            '?key=' + process.env.GOODREADS_API +
            '&v=2&per_page=200'

function handleShelf (shelf) {
  // if the shelf is an array there's more than one shelf
  if (Array.isArray(shelf)) {
    shelf = shelf[0] // pick the first shelf
  }

  return shelf.name // just get the name of the shelf
}

function getBooks () {
  return new Promise(resolve => {
    return request(uri, (error, response, body) => {
      if (error) {
        return resolve({ error })
      }

      if (response.statusCode !== 200) {
        return resolve({ error: `Response was not OK: ${response.statusCode}` })
      }

      const result = parser.toJson(body, { object: true })
      const reviews = result.GoodreadsResponse.reviews.review

      const score2Text = ['', '★', '★★', '★★★', '★★★★', '★★★★★']

      let books = reviews.map(review => {
        const book = review.book

        const date = new Date(review.date_updated)
        const output = {
          time: {
            published: {
              human: `${date.toDateString()} ${date.toLocaleTimeString('en-GB')}`,
              iso: date.toISOString()
            }
          },
          book: {
            id: book.id.$t,
            title: book.title,
            image: book.small_image_url,
            uri: book.link
          },
          shelf: handleShelf(review.shelves.shelf),
          uri: review.url
        }

        if (review.rating) {
          output.rating = {
            text: score2Text[+review.rating],
            score: review.rating
          }
        }

        if (review.body.length > 0) {
          output.review = review.body
        }

        if (review.spoilers_flag === 'true') {
          output.spoilers = true
        }

        if (typeof review.read_at !== 'object') {
          const date = new Date(review.read_at)

          output.time.read = {
            human: `${date.toDateString()} ${date.toLocaleTimeString('en-GB')}`,
            iso: date.toISOString()
          }
        }

        // check if there's an image and add if there is
        // no photo is in the url if there is no image
        if (book.small_image_url.indexOf('/nophoto/') <= -1) {
          output.image = book.small_image_url
        }

        return output
      })

      resolve(books)
    })
  })
}

module.exports = getBooks

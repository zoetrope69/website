[![Netlify Status](https://api.netlify.com/api/v1/badges/cca05489-b5e5-453a-8c2d-01149b1d7f6f/deploy-status)](https://app.netlify.com/sites/zaccolley/deploys)

# website

my [current](https://zac.land) website

## installation

1. copy `.env-example` to `.env`
1. get a [last.fm api key](https://www.last.fm/api/) and [songkick api key](https://www.songkick.com/developer) (optional - this project still runs without them)
1. `npm install`

## develoment

```bash
npm start
```

## deploy

push to `master` branch on GitHub. Netlify builds from there automatically.

make sure to bump the `service-work.js` version otherwise people may see stale content.

[![Netlify Status](https://api.netlify.com/api/v1/badges/cca05489-b5e5-453a-8c2d-01149b1d7f6f/deploy-status)](https://app.netlify.com/sites/zoetrope/deploys)

# website

my [current](https://zoetrope.fyi) website

## installation

1. copy `.env-example` to `.env`
1. get a [last.fm api key](https://www.last.fm/api/) (optional - this project still runs without them)
1. `npm install`

## development

```bash
npm start
```

## deploy

push to `main` branch on GitHub. Netlify builds from there automatically.

make sure to bump the `service-work.js` version otherwise people may see stale content.

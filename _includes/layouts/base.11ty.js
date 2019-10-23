function base(data, that = this) {
  const {
    metadata,
    page
  } = data

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${data.title} | ${metadata.title} - ${metadata.description}</title>

        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#ddd">

        <link rel="image_src" href="${data.image || metadata.author.image}">

        <link rel="icon" href="/images/icons/notepad-16x16.png" />
        <link rel="icon" sizes="192x192" href="/images/icons/notepad-192x192.png">

        <style>${that.getStyles()}</style>

        <meta name="title" content="${data.title} | ${metadata.title}">
        <meta name="description" content="${data.description || metadata.description}">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="${metadata.url}${page.url}">
        <meta property="og:title" content="${data.title} | ${metadata.title}">
        <meta property="og:description" content="${data.description || metadata.description}">
        <meta property="og:image" content="${data.image || metadata.author.image}">

        <!-- Twitter -->
        <meta property="twitter:card" content="summary">
        <meta name="twitter:site" content="@zaccolley" />
        <meta name="twitter:creator" content="@zaccolley" />
        <meta property="twitter:url" content="${metadata.url}${page.url}">
        <meta property="twitter:title" content="${data.title} | ${metadata.title}">
        <meta property="twitter:description" content="${data.description || metadata.description}">
        <meta property="twitter:image" content="${data.image || metadata.author.image}">
        
        <link rel="manifest" href="/manifest.json">
      </head>

      <body>
        <a class="skip-to-main-content-link" href="#main">
          <span aria-hidden="true">⏭️</span>
          Skip to main content
        </a>
      
        <div class="wrapper">
          <header class="header">
            <div class="header__titles">
              <span class="header__title">
                ${metadata.title}
              </span>
              <p class="header__subtitle">
                ${metadata.description}
              </p>
            </div>

            <nav class="header__nav">
              <ul class="header__nav__list">
                <li class="header__nav__list__item">
                  <a href="/">
                    <span aria-hidden="true">🏠</span>
                    Home
                  </a>
                </li>
                <li class="header__nav__list__item">
                  <a href="/posts/">
                    <span aria-hidden="true">📝</span>
                    Posts
                  </a>
                </li>
                <li class="header__nav__list__item">
                  <a href="/projects/">
                    <span aria-hidden="true">🎨</span>
                    Projects
                  </a>
                </li>
              </ul>
            </nav>
          </header>

          <main class="main" id="main">
            <h1>${data.title}</h1>

            ${data.content}
          </main>	

          <footer class="footer">
            Last built on ${that.getUTCDateTime()} UTC.

            <div class="footer__counter" aria-hidden="true">
              Counter:
              <img
                class="footer__counter__image"
                src="https://adalytics-zac.glitch.me/counter.png?fallback=zac.land"
                alt=""
              >
            </div>
          </footer>
        </div>
      </body>
    </html>
  `;
};

module.exports = base;

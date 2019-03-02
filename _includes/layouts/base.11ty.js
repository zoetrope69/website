const styles = require('../styles.js');

function base(data) {
  const {
    metadata,
    page
  } = data

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${metadata.title} - ${metadata.description}</title>

        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#ddd">

        <link rel="image_src" href="${metadata.author.image}">

        <link rel="icon" href="/images/icons/notepad-16x16.png" />
        <link rel="icon" sizes="192x192" href="/images/icons/notepad-192x192.png">

        <style>${styles}</style>

        <meta name="title" content="${metadata.title}">
        <meta name="description" content="${metadata.description}">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="${metadata.url}${page.url}">
        <meta property="og:title" content="${metadata.title}">
        <meta property="og:description" content="${metadata.description}">
        <meta property="og:image" content="${metadata.author.image}">

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="${metadata.url}${page.url}">
        <meta property="twitter:title" content="${metadata.title}">
        <meta property="twitter:description" content="${metadata.description}">
        <meta property="twitter:image" content="${metadata.author.image}">
        
        <link rel="manifest" href="/manifest.json">
      </head>

      <body>
        <div class="wrapper">
          <header>
            <h1>
              ${metadata.title}
            </h1>
            <p>${metadata.description}</p>
          </header>

          <main>
            ${data.content}
          </main>	
        </div>

        <script>
          if('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
              .then(function(registration) {
                    console.log('Service Worker Registered');
              });
            navigator.serviceWorker.ready.then(function(registration) {
                console.log('Service Worker Ready');
            });
          }
        </script>
      </body>
    </html>
  `;
}

module.exports = base
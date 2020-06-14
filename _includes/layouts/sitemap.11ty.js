function sitemap(data) {
  const { metadata } = data;

  // ignore any posts with the sitemapIgnore flag
  const pages = data.collections.all.filter((item) => !item.data.sitemapIgnore);

  const pageXML = pages
    .map((item) => {
      const itemDate = new Date(item.date).toISOString();

      return `
      <url>
        <loc>${metadata.url}${item.url}</loc>
        <lastmod>${itemDate}</lastmod>
        <changefreq>${
          item.data.sitemapChangeFrequency || "monthly"
        }</changefreq>
      </url>
    `.trim();
    })
    .join("\n");

  return `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pageXML}
    </urlset>
  `.trim();
}

module.exports = sitemap;

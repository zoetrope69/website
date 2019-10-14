const baseLayout = require('./base.11ty');

function post(data) {
  data.content = `
    <article class="post">
      <header class="post__header">
        <h1 class="post__header__title">${data.title}</h1>
      </header>

      <div class="post__content">
        ${data.content}
      </div
    </article>
  `;

  return baseLayout(data, this);
};

module.exports = post;
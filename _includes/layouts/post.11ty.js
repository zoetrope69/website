const { format: dateFormat } = require('date-fns');
const baseLayout = require('./base.11ty');

function post(data) {
  data.content = `
    <article class="post">
      <time class="post__date" datetime="${data.date}">
        ${dateFormat(new Date(data.date), 'do LLLL yyyy')}
      </time>
      <div class="post__content">
        ${data.content}
      </div
    </article>
  `;

  return baseLayout(data, this);
};

module.exports = post;
const { format: dateFormat } = require("date-fns");
const baseLayout = require("./base.11ty");

function post(data) {
  data.content = `
    <article class="post">
      <time class="post__date" datetime="${data.date}">
        ${dateFormat(new Date(data.date), "do LLLL yyyy")}
      </time>
      <div class="post__content">
        ${data.content}
      </div>
      <div class="post__author">
        <h2>About z</h2>

        <p>I'm z and I like making stuff <span aria-hidden="true">🤹‍♂️🔌🎨</span>.</p>
        
        <p>I'm passionate about removing barriers for people. I'm trying to do this through things like education, accessibility, diversity and inclusion <span aria-hidden="true">🚧🚫</span>.</p>
      </div>
    </article>
  `;

  return baseLayout(data, this);
}

module.exports = post;

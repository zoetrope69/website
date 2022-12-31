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
        <h2>About Zac</h2>
        
        <picture>
          <source srcset="/images/zac-128.gif"
                  media="(min-width: 1200px)">
          <img class="my-face my-face--post"
              src="/images/zac-64.gif"
              alt="Zac in their human form"
              loading="lazy">
        </picture>

        <p>I'm Zac and I like making stuff <span aria-hidden="true">🤹‍♂️🔌🎨</span>.</p>
        
        <p>I'm passionate about removing barriers for people. I'm trying to do this through things like education, accessibility, diversity and inclusion <span aria-hidden="true">🚧🚫</span>.</p>
        
        <a href="/">Find out more about me and/get in touch...</a>
      </div>
    </article>
  `;

  return baseLayout(data, this);
}

module.exports = post;

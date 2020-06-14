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
          <source srcset="https://www.gravatar.com/avatar/26ab7600fc89f94711ec3b7db40d039b?s=128"
                  media="(min-width: 1200px)">
          <img class="my-face my-face--post"
              src="https://www.gravatar.com/avatar/26ab7600fc89f94711ec3b7db40d039b?s=64"
              alt="Zac in his human form"
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

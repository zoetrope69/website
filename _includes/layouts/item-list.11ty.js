const { format: dateFormat } = require("date-fns");
const baseLayout = require("./base.11ty");

const getItems = (data) => {
  if (!data.collections.post) {
    return data.externalPosts;
  }

  const internalPosts = data.collections.post.map((post) => post.data);
  return [...data.externalPosts, ...internalPosts];
};

const getItemMedia = (item) => {
  const isVideo = item.video;

  if (isVideo) {
    return `
      <video autoplay="" loop="" muted="" inline="" title="">
        <source src="${item.video}" type="video/mp4">
      </video>
    `;
  }

  return `
    <img
      src="${item.image}"
      alt=""
      width="200"
      height="150"
      loading="lazy"
    />
  `;
};

function itemList(data) {
  const items = getItems(data);
  const sortedItems = items.sort((a, b) => {
    if (new Date(a.date) <= new Date(b.date)) {
      return 1;
    }

    return -1;
  });

  data.content = `
    ${data.content}
    
    <ol class="items">
      ${sortedItems
        .map((item) => {
          const { date, description, emoji, externalLink, page, title } = item;

          return `
          <li class="item">
            <a href="${externalLink || page.url}">
              <span class="item__media">
                ${getItemMedia(item)}
              </span>
              <span class="item__content">
                <span class="item__details">
                  <time class="item__details__time" datetime="${date}">
                    ${dateFormat(new Date(date), "do LLLL yyyy")}
                  </time>
                  <span class="item__details__emoji" aria-hidden="true">️️️
                  ${emoji}
                  </span>
                </span>
                <span class="item__title">
                  ${title}
                </span>
                <span class="item__description">
                  ${description}
                </span>
              </span>
            </a>
          </li>
        `;
        })
        .join("")}
    </ol>
  `;

  return baseLayout(data, this);
}

module.exports = itemList;

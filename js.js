document.addEventListener("DOMContentLoaded", function() {
  M.AutoInit();
  loadNews();
});

http = () => {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", url);

        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }

          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },

    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();

        xhr.open("POST", url);

        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }

          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    }
  };
};

const myHttp = http();
const mainContainer = document.querySelector(".news-content");
const form = document.forms["newsParam"];
const countySelect = form.elements["country"];
const searchInput = form.elements["search"];
const linksArr = document.querySelectorAll(".news-cathegory__link");

const newsService = (function() {
  const apiKey = "3b65ae1173ce482f935f54e5f8fe07a1";
  const apiUrl = "https://newsapi.org/v2";

  return {
    topHeadlines(country = "ru", cb) {
      myHttp.get(
        `${apiUrl}/top-headlines?country=${country}&apiKey=${apiKey}`,
        cb
      );
    },
    everything(query, cb) {
      myHttp.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
    },
    cathegory(cat, cb) {
      myHttp.get(
        `${apiUrl}/top-headlines?country=ru&category=${cat}&apiKey=${apiKey}`,
        cb
      );
    }
  };
})();

function loadNews() {
  newsService.topHeadlines("ru", getResponse);
}

// Здесь Я получаю массив с новостями
function getResponse(err, res) {
  if (err) {
    console.log(err);
    return;
  }
  renderNews(res.articles);
}

function renderNews(arr) {
  let fragment = "";

  arr.forEach(({ description, title, url, urlToImage }) => {
    const result = createPost(description, title, url, urlToImage);
    fragment += result;
  });
  mainContainer.insertAdjacentHTML("afterbegin", fragment);
}

function createPost(description, title, url, urlToImage) {
  return `
  <div class="news-container">
  <div class="news-container__image-container">
    <img src="${urlToImage}" alt="" class="news-container__img" />
  </div>
  <div class="news-container__content">
    <h5 class="news-container__title">
      ${title}
    </h5>
    <p class="news-container__text">
     ${description}
    </p>
    <div class="news-container__learn-more">
         <a href="${url}">Узнать больше</a>
    </div>
  </div>
</div>
  `;
}

function clear() {
  mainContainer.innerHTML = "";
}

form.addEventListener("submit", e => {
  e.preventDefault();
  clear();

  const country = countySelect.value;
  const search = searchInput.value;

  if (!search) {
    newsService.topHeadlines(country, getResponse);
  } else {
    newsService.everything(search, getResponse);
  }
});

linksArr.forEach(item => {
  item.addEventListener("click", function(e) {
    e.preventDefault();
    clear();

    const cat = this.dataset.set;

    newsService.cathegory(cat, getResponse);
  });
});

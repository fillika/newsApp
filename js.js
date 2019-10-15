document.addEventListener("DOMContentLoaded", function() {
  M.AutoInit();
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

const newsService = (function() {
  const apiKey = "3b65ae1173ce482f935f54e5f8fe07a1";
  const apiUrl = "https://newsapi.org/v2";

  return {
    topHeadlines(country = "ru", cb) {
      myHttp.get(`${apiUrl}/top-headlines?country=${country}&apiKey=${apiKey}`);
    },
    everything(query, cb) {
        myHttp.get(`${apiUrl}/top-headlines?country=${country}&apiKey=${apiKey}`);
    },
    cathegory(cat, cb) {
        myHttp.get(`${apiUrl}/top-headlines?country=ru&category=${cat}&apiKey=${apiKey}`);
    }
  };
})();

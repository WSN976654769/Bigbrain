/**
 * Make a request to `path` with `options` and parse the response as JSON.
 * @param {*} path The url to make the reques to.
 * @param {*} options Additiona options to pass to fetch.
 */

const getJSON = (path, options) => new Promise((resolve, reject) => {
  fetch(path, options)
    .then((res) => {
      if (res.status === 200) {
        resolve(res.json());
      } else {
        res.json().then((decode) => {
          // console.log(decode);
          reject(decode.error);
        })
          .catch((err) => alert(err));
      }
    });
});

/**
 * This is a sample class API which you may base your code on.
 * You may use this as a launch pad but do not have to.
 */
export default class API {
  /** @param {String} url */
  constructor(url) {
    this.url = url;
  }

  /** @param {String} path */
  post(path, options) {
    return getJSON(`${this.url}/${path}`, {
      ...options,
      method: 'POST',
    });
  }

  get(path, options) {
    return getJSON(`${this.url}/${path}`, {
      ...options,
      method: 'GET',
    });
  }

  put(path, options) {
    return getJSON(`${this.url}/${path}`, {
      ...options,
      method: 'PUT',
    });
  }

  delete(path, options) {
    return getJSON(`${this.url}/${path}`, {
      ...options,
      method: 'DELETE',
    });
  }
}

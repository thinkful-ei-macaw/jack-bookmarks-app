const BASE_URL =
  'https://thinkful-list-api.herokuapp.com/jacklansing/bookmarks';

const request = (...args) => {
  let error;
  fetch(...args)
    .then(res => {
      if (!res.ok) {
        error = { code: res.status };
      }
      if (!res.headers.get('content-type').includes('json')) {
        error.message = res.statusText;
        return Promise.reject(error);
      }
      return res.json();
    })
    .then(data => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      console.log(data);
      return data;
    });
};

const getBookmarks = () => {
  console.log(BASE_URL);
  return request(`${BASE_URL}`);
};

/* For testing purposes only */
const testMark = {
  title: 'Google',
  url: 'https://www.google.com',
  desc: 'The best search enginge on the net',
  rating: 5
};
/* For testing purposes only */

const newBookmark = bookmark => {
  return request(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testMark)
  });
};

export default {
  getBookmarks,
  newBookmark
};

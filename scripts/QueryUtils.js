const BASE_URL =
  'https://thinkful-list-api.herokuapp.com/jacklansing/bookmarks/';

const request = (...args) => {
  let error;
  return fetch(...args)
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
      return data;
    });
};

export const getBookmarks = () => {
  return request(BASE_URL);
};

const newBookmark = bookmarkFormData => {
  return request(BASE_URL, {
    method: 'post',
    headers: { 'Content-Type': ' application/json' },
    body: JSON.stringify(bookmarkFormData)
  });
};

const updateBookmark = (id, updates) => {
  //Optional: implement updating data
  console.log(JSON.stringify(updates));
  return request(`${BASE_URL}${id}`, {
    method: 'patch',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
};

const deleteBookmark = id => {
  return request(`${BASE_URL}/${id}`, { method: 'DELETE' });
};

export default {
  getBookmarks,
  newBookmark,
  deleteBookmark,
  updateBookmark
};

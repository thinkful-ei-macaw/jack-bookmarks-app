import { getBookmarks as queryBookmarks } from './QueryUtils.js';

const bookmarks = [];
let filterRating;
let error = null;

const addBookmark = function(bookmark) {
  bookmark.showDetails = false;
  this.bookmarks.push(bookmark);
};

const populateStore = function() {
  return queryBookmarks().then(bookmarks => {
    bookmarks.forEach(bm => this.addBookmark(bm));
  });
};

const findById = function(id) {
  return this.bookmarks.find(e => e.id === id);
};

const deleteBookmark = function(id) {
  const currentBookmark = this.findById(id);
  const index = this.bookmarks.indexOf(currentBookmark);
  this.bookmarks.splice(index, 1);
};

const toggleShowDetails = function(id) {
  const currentBookmark = this.findById(id);
  currentBookmark.showDetails = !currentBookmark.showDetails;
};

const resetShowDetails = function() {
  this.bookmarks.map(e => (e.showDetails = false));
};

const setFilterRating = function(rating) {
  this.filterRating = rating;
};

const getFilterRating = function() {
  return this.filterRating;
};

const updateBookmark = function(id, data) {
  const currentBookmark = this.findById(id);
  Object.assign(currentBookmark, data);
};

const setError = function(error) {
  this.error = error;
};

export default {
  addBookmark,
  deleteBookmark,
  setFilterRating,
  getFilterRating,
  setError,
  toggleShowDetails,
  resetShowDetails,
  bookmarks,
  findById,
  populateStore,
  updateBookmark
};

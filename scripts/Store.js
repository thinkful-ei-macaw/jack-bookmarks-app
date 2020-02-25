const bookmarks = [];
let filterRating = 1;
let error = null;
let currentlyAdding = false;

const findById = function(id) {
  return this.bookmarks.find(e => e.id === id);
};

const addBookmark = function(bookmark) {
  console.log(bookmark);
  bookmark.showDetails = false;
  this.bookmarks.push(bookmark);
};

const deleteBookmark = function(id) {
  const currentBookmark = findById(id);
  const index = bookmarks.indexOf(currentBookmark);
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
  console.log('New rating is: ' + rating);
};

const getFilterRating = function() {
  return this.filterRating;
};

export default {
  addBookmark,
  deleteBookmark,
  setFilterRating,
  getFilterRating,
  error,
  currentlyAdding,
  toggleShowDetails,
  resetShowDetails,
  bookmarks,
  findById
};

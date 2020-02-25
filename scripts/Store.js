const bookmarks = [];
let filterRating = 1;
let error = null;
let currentlyAdding = false;

const findById = id => bookmarks.find(e => e.id === id);

const addBookmark = bookmark => {
  console.log(bookmark);
  bookmark.showDetails = false;
  bookmarks.push(bookmark);
};

const deleteBookmark = id => {
  const currentBookmark = findById(id);
  const index = bookmarks.indexOf(currentBookmark);
  bookmarks.splice(index, 1);
};

const toggleShowDetails = id => {
  const currentBookmark = findById(id);
  currentBookmark.showDetails = !currentBookmark.showDetails;
};

export default {
  addBookmark,
  deleteBookmark,
  filterRating,
  error,
  currentlyAdding,
  toggleShowDetails,
  bookmarks,
  findById
};

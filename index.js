import QueryUtils from './scripts/QueryUtils.js';
import Bookmarks from './scripts/Bookmarks.js';

const setupEventListeners = () => {
  Bookmarks.clickNewBookmark();
  Bookmarks.clickFilterBookmark();
  Bookmarks.clickExpandBookmark();
};

const main = () => {
  //QueryUtils.newBookmark();
  // QueryUtils.updateBookmark('ck70vd5hd00100kshfd2yasow');
  QueryUtils.getBookmarks();
  setupEventListeners();
};

$(main);

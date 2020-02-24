import QueryUtils from './QueryUtils.js';
import Store, { testJson } from './Store.js';

const main = () => {
  //QueryUtils.newBookmark();
  QueryUtils.getBookmarks();
};

$(main);

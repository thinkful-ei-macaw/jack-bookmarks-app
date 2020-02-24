import QueryUtils from './QueryUtils.js';

const main = () => {
  QueryUtils.newBookmark();
  console.log(QueryUtils.getBookmarks());
};

$(main);

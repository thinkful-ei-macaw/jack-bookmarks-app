'use strict';
import Store from './Store.js';
import QueryUtils from './QueryUtils.js';

const clickNewBookmark = () => {
  //Click handler for new bm
  $('#root').on('click', '.js-new-button', event => {
    render('#root', generateNewBookmarkHtml());
    clickCancelBookmark();
    clickCreateBookmark();
  });
};

const clickFilterBookmark = () => {
  //Click handler for bm filter
  $('#root').on('change', '#filter-rating', event => {
    console.log($('#filter-rating').val());
  });
};

const clickExpandBookmark = () => {
  //Click handler for expand bm details
  $('#root').on('click', '.js-bm-expand', event => {
    console.log('Expand details');
  });
};

const clickCloseBookmark = () => {
  //Go back / close bm details
};

const clickDeleteBookmark = () => {
  //Click handler for delete bookmark in details view
};

const clickCancelBookmark = () => {
  //Click handler for cancel creation of a new bookmark
  $('#root').on('click', '.js-back-button', event => {
    renderHome();
  });
};

const clickCreateBookmark = () => {
  //Click handler for confirm create new bookmark
  //Must check all required details are provided
  $('form.js-new-item-form').submit(event => {
    event.preventDefault();
    let form = document.getElementById('new-item-form');
    let formData = new FormData(form);
    QueryUtils.newBookmark(formData).then(() => populateStore());
  });
};

const generateStartHtml = () => {
  let html = `
  <h1>My Bookmarks</h1>
      <button class="new-button js-new-button">New</button>
      <form class="filter-menu js-filter-menu">
        <label for="filter-rating">Minimum rating</label>
        <select id="filter-rating">
          <option>None</option>
          <option>1 star</option>
          <option>2 star</option>
          <option>3 star</option>
          <option>4 star</option>
          <option>5 star</option>
        </select>
      </form>
      <ul class="bookmark-list js-bookmark-list">`;
  Store.bookmarks.forEach(bm => {
    html += `
        <li class="bookmark-item js-bookmark-item">
          <button
            class="bm-expand js-bm-expand"
            role="button"
            aria-expanded="false"
          >
            <span class="bm-title js-bm-title">${bm.title}</span
            ><span class="bm-rating js-bm-rating">${bm.rating}</span>
          </button>
        </li>
        `;
  });
  html += '</ul>';
  return html;
};

const generateNewBookmarkHtml = () => {
  return `
  <h1>My Bookmarks</h1>
      <button class="back-button js-back-button">Back</button>
      <form id="new-item-form" class="new-item-form js-new-item-form">
        <label for="title">Name:</label>
        <input type="text" id="title" name="title" required/>
        <br />
        <label for="url">URL:</label>
        <input type="url" id="url" name="url" required/>
        <br />
        <label for="desc">Description:</label>
        <input type="text" id="desc" name="desc" />
        <label for="rating">Rating:</label>
        <select id="rating" name="rating">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </select>
        <br />
        <button type="submit">Create!</button>
      </form>
  `;
};

const render = (target, component) => {
  //Simple flexible render
  $(target).html(component);
};

const renderHome = () => {
  render('#root', generateStartHtml());
};

const setupEventListners = () => {
  clickNewBookmark();
  clickFilterBookmark();
  clickExpandBookmark();
};

const populateStore = () => {
  QueryUtils.getBookmarks().then(bookmarks => {
    bookmarks.forEach(bm => Store.addBookmark(bm));
    renderHome();
  });
};

const main = () => {
  populateStore();
  setupEventListners();
};

$(main);

'use strict';
import Store from './Store.js';
import QueryUtils from './QueryUtils.js';

const clickNewBookmark = () => {
  //Click handler for new bm
  $('#root').on('click', '.js-new-button', event => {
    console.log('clicked');
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
  //Optional: collapse bm details when close button is pressed (may remove)
};

const clickDeleteBookmark = () => {
  //Click handler for delete bookmark in details view
};

const clickCancelBookmark = () => {
  //Click handler for cancel creation of a new bookmark
};

const clickCreateBookmark = () => {
  //Click handler for confirm create new bookmark
  //Must check all required details are provided
};

const generateStartHtml = () => {
  return `
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
      <ul class="bookmark-list js-bookmark-list">
        <li class="bookmark-item js-bookmark-item">
          <button
            class="bm-expand js-bm-expand"
            role="button"
            aria-expanded="false"
          >
            <span class="bm-title js-bm-title">Title</span
            ><span class="bm-rating js-bm-rating">*****</span>
          </button>
        </li>
      </ul>
  `;
};

const render = (target, component) => {
  //Simple flexible render
  $(target).html(component);
};

const setupEventListners = () => {
  clickNewBookmark();
  clickFilterBookmark();
  clickExpandBookmark();
};

const main = () => {
  render('#root', generateStartHtml());
  setupEventListners();
};

$(main);

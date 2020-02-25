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
    Store.filterRating = $('#filter-rating').val();
    renderHome();
  });
};

const getBookmarkIdFromElement = item => {
  return $(item)
    .closest('.js-bookmark-item')
    .data('item-id');
};

const clickExpandBookmark = () => {
  //Click handler for expand bm details
  $('#root').on('click', '.js-bm-expand', event => {
    Store.bookmarks.map(e => (e.showDetails = false));
    const id = getBookmarkIdFromElement(event.currentTarget);
    Store.toggleShowDetails(id);
    renderHome();
    clickCloseBookmark();
    clickDeleteBookmark();
  });
};

const clickCloseBookmark = () => {
  //Go back / close bm details
  $('#root').on('click', '.js-close-bm', event => {
    event.stopPropagation();
    const id = getBookmarkIdFromElement(event.currentTarget);
    Store.toggleShowDetails(id);
    renderHome();
    clickCloseBookmark();
  });
};

const clickDeleteBookmark = () => {
  //Click handler for delete bookmark in details view
  $('#root').on('click', '.js-delete-bm', event => {
    event.stopPropagation();
    const id = getBookmarkIdFromElement(event.currentTarget);
    QueryUtils.deleteBookmark(id)
      .then(() => Store.deleteBookmark(id))
      .then(() => renderHome());
  });
};

const clickCancelBookmark = () => {
  //Click handler for cancel creation of a new bookmark
  $('#root').on('click', '.js-back-button', event => {
    renderHome();
  });
};

const createBookmarkObject = formData => {
  const formObj = {};
  formData.forEach((val, name) => (formObj[name] = val));
  return formObj;
};

const clickCreateBookmark = () => {
  //Click handler for confirm create new bookmark
  //Must check all required details are provided
  $('form.js-new-item-form').submit(event => {
    event.preventDefault();
    let form = document.getElementById('new-item-form');
    let formData = new FormData(form);
    const newBookmark = createBookmarkObject(formData);
    QueryUtils.newBookmark(newBookmark)
      .then(newBookmark => Store.addBookmark(newBookmark))
      .then(() => renderHome());
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
          <option value="1">1 star</option>
          <option value="2">2 star</option>
          <option value="3">3 star</option>
          <option value="4">4 star</option>
          <option value="5">5 star</option>
        </select>
      </form>
      <ul class="bookmark-list js-bookmark-list">`;

  Store.bookmarks.forEach(bm => {
    if (bm.rating >= Store.filterRating) {
      if (bm.showDetails && bm.rating) {
        html += `
          <li data-item-id="${bm.id}" class="bookmark-item js-bookmark-item">
            <div class="expanded-content js-expanded-content">
              <h2 id="bm-title js-bm-title">${bm.title}</h2>
              <a href="${bm.url}">Visit Site</a>
              <p>${bm.desc}</p>
              <button clas="js-edit-bm edit-bm">Edit</button>
              <button class="js-close-bm close-bm">Close</button>
              <button class="js-delete-bm delete-bm">Delete</button>
            </div>
          </li>`;
      } else {
        html += `
          <li data-item-id="${bm.id}" class="bookmark-item js-bookmark-item">
            <button
              class="bm-expand js-bm-expand"
              role="button"
              aria-expanded="false"
            >
              <span class="bm-title js-bm-title">${bm.title}</span>
              <span class="bm-rating js-bm-rating">${bm.rating}</span>
            </button>
          </li>
        `;
      }
    }
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

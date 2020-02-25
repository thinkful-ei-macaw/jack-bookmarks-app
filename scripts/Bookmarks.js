import Store from './Store.js';
import QueryUtils from './QueryUtils.js';

const clickNewBookmark = () => {
  //Click handler for new bm
  $('#root').on('click', '.js-new-button', () => {
    render('#root', generateNewBookmarkHtml());
    clickCancelBookmark();
    clickCreateBookmark();
  });
};

const clickFilterBookmark = () => {
  //Click handler for bm filter
  $('#root').on('change', '#filter-rating', () => {
    let newRating = Number($('#filter-rating').val());
    Store.setFilterRating(newRating);
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
    Store.resetShowDetails();
    const id = getBookmarkIdFromElement(event.currentTarget);
    Store.toggleShowDetails(id);
    renderHome();
    clickCloseBookmark();
    clickDeleteBookmark();
    clickEditBookmark();
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
  $('#root').on('click', '.js-back-button', () => {
    Store.resetShowDetails();
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
      .then(() => Store.resetShowDetails())
      .then(() => renderHome());
  });
};

const clickEditBookmark = () => {
  $('#root').on('click', '.js-edit-bm', event => {
    console.log('event fired');
    // event.stopPropagation();
    const id = getBookmarkIdFromElement(event.currentTarget);
    const bookmark = Store.findById(id);
    renderEditView(bookmark);
    clickCancelBookmark();
    clickUpdateBookmark(id);
  });
};

const clickUpdateBookmark = id => {
  $('form.js-update-item-form').submit(event => {
    event.preventDefault();
    let form = document.getElementById('update-item-form');
    let formData = new FormData(form);
    const newBookmark = createBookmarkObject(formData);
    QueryUtils.updateBookmark(id, newBookmark);
  });
};

const generateFilterHtml = () => {
  let currentRating = Store.getFilterRating();
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `
    <option value="${i}" ${
      currentRating === i ? 'selected' : ''
    }>${i} Stars</option>
   `;
  }
  return html;
};

const generateStartHtml = () => {
  let html = `
  <h1>My Bookmarks</h1>
      <button class="new-button js-new-button">New</button>
      <form class="filter-menu js-filter-menu">
        <label for="filter-rating">Minimum rating</label>
        <select id="filter-rating">
          ${generateFilterHtml()}
        </select>
      </form>
      <ul class="bookmark-list js-bookmark-list">`;
  Store.bookmarks.forEach(bm => {
    if (bm.rating >= Store.getFilterRating()) {
      if (bm.showDetails && bm.rating) {
        html += `
          <li data-item-id="${bm.id}" class="bookmark-item js-bookmark-item">
            <div class="expanded-content js-expanded-content">
              <h2 id="bm-title js-bm-title">${bm.title}</h2>
              <a href="${bm.url}">Visit Site</a>
              <p>${bm.desc}</p>
              <button class="js-edit-bm edit-bm">Edit</button>
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

const generateEditViewHtml = bookmark => {
  return `
      <h1>My Bookmarks</h1>
      <button class="back-button js-back-button">Cancel</button>
      <form id="update-item-form" class="update-item-form js-update-item-form">
        <label for="title">Name:</label>
        <input type="text" id="title" name="title" value=${bookmark.title} required/>
        <br />
        <label for="url">URL:</label>
        <input type="url" id="url" name="url" value=${bookmark.url} required/>
        <br />
        <label for="desc">Description:</label>
        <input type="text" id="desc" name="desc" value="${bookmark.desc}" />
        <label for="rating">Rating:</label>
        <select id="rating" name="rating" value="${bookmark.rating}">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </select>
        <br />
        <button class="js-edit-bookmark" type="submit">Update Bookmark</button>
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

const renderEditView = bookmark => {
  render('#root', generateEditViewHtml(bookmark));
};

const setupEventListners = () => {
  clickNewBookmark();
  clickFilterBookmark();
  clickExpandBookmark();
};

const main = () => {
  Store.populateStore()
    .then(() => renderHome())
    .then(() => setupEventListners());
  Store.setFilterRating(1);
};

$(main);

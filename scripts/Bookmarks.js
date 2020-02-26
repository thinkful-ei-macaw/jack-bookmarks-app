import Store from './Store.js';
import QueryUtils from './QueryUtils.js';

const clickNewBookmark = () => {
  $('#root').on('click', '.js-new-button', () => {
    render('#root', generateNewBookmarkHtml());
    clickCancelBookmark();
    clickCreateBookmark();
  });
};

const clickFilterBookmark = () => {
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
  $('#root').on('click', '.js-close-bm', event => {
    event.stopPropagation();
    const id = getBookmarkIdFromElement(event.currentTarget);
    Store.toggleShowDetails(id);
    renderHome();
    clickCloseBookmark();
  });
};

const clickDeleteBookmark = () => {
  $('#root').on('click', '.js-delete-bm', event => {
    event.stopPropagation();
    const id = getBookmarkIdFromElement(event.currentTarget);
    QueryUtils.deleteBookmark(id)
      .then(() => Store.deleteBookmark(id))
      .then(() => renderHome())
      .catch(error => renderError(error));
  });
};

const clickCancelBookmark = () => {
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
  $('form.js-new-item-form').submit(event => {
    event.preventDefault();
    let form = document.getElementById('new-item-form');
    let formData = new FormData(form);
    const newBookmark = createBookmarkObject(formData);
    QueryUtils.newBookmark(newBookmark)
      .then(newBookmark => Store.addBookmark(newBookmark))
      .then(() => Store.resetShowDetails())
      .then(() => renderHome())
      .catch(error => renderError(error));
  });
};

const clickEditBookmark = () => {
  $('#root').on('click', '.js-edit-bm', event => {
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
    QueryUtils.updateBookmark(id, newBookmark)
      .then(() => Store.updateBookmark(id, newBookmark))
      .then(() => renderHome())
      .catch(error => renderError(error));
  });
};

const clickCloseError = () => {
  $('#alert-container').on('click', '.js-error-close', () => {
    console.log('clicked close');
    renderError(null);
  });
};

const generateFilterHtml = () => {
  let currentRating = Store.getFilterRating();
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `
    <option value="${i}" ${currentRating === i ? 'selected' : ''}>${'★'.repeat(
      i
    )}</option>
   `;
  }
  return html;
};

const generateStartHtml = () => {
  let html = `
  <h1>My Bookmarks</h1>
      <button class="new-button js-new-button">New</button>
      <form class="filter-menu js-filter-menu">
        <label for="filter-rating">Minimum rating: </label>
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
              <a class="anchor-visit" href="${bm.url}">Visit Site</a>
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
            >
              <span class="bm-title js-bm-title">${bm.title}</span>
              <span class="bm-rating js-bm-rating">${'★'.repeat(
                bm.rating
              )}</span>
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
      <form id="new-item-form" class="new-item-form js-new-item-form">
      <h2>Create a New Bookmark!</h2>
      <div>
        <label for="title">Name:</label>
        <input type="text" id="title" name="title" required/>
        </div>
        <div>
        <label for="url">URL:</label>
        <input type="url" id="url" name="url" required/>
        </div>
        <div>
        <label for="desc">Description:</label>
        <input type="text" id="desc" name="desc" />
        </div>
        <div>
        <label for="rating">Rating:</label>
        <select id="rating" name="rating">
          ${generateRatingHtml(1)}
        </select>
        </div>
        <button class="new-item-submit-button" type="submit">Create!</button>
        <button class="back-button-new-bm js-back-button">Cancel</button>
      </form>
  `;
};

const generateRatingHtml = currentRating => {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `
    <option value="${i}" ${
      Number(currentRating) === i ? 'selected' : ''
    }>${'★'.repeat(i)}</option>
   `;
  }
  return html;
};

const generateEditViewHtml = bookmark => {
  return `
      <h1>My Bookmarks</h1>
      <form id="update-item-form" class="update-item-form js-update-item-form">
      <h2>Update bookmark below:</h2>
      <div>
        <label for="title">Name:</label>
        <input type="text" id="title" name="title" value=${
          bookmark.title
        } required/>
        </div>
        <div>
        <label for="url">URL:</label>
        <input type="url" id="url" name="url" value=${bookmark.url} required/>
        </div>
        <div>
        <label for="desc">Description:</label>
        <input type="text" id="desc" name="desc" value="${bookmark.desc}" />
        </div>
        <div>
        <label for="rating">Rating:</label>
        <select id="rating" name="rating">
          ${generateRatingHtml(bookmark.rating)}
        </select>
        </div>
        <button class="js-edit-bookmark update-item-submit-button" type="submit">Update Bookmark</button>
        <button class="back-button js-back-button">Cancel</button>
      </form>
  `;
};

const generateErrorHtml = error => {
  if (error === null) {
    return '';
  } else {
    return `
  <div role="alert" class="error-alert">
    <p>Oops! An error occured: ${error.message}</p>
    <button class="error-close js-error-close">Close Error</button>
  </div>
  `;
  }
};

const render = (target, component) => {
  $(target).html(component);
};

const renderHome = () => {
  render('#root', generateStartHtml());
};

const renderEditView = bookmark => {
  render('#root', generateEditViewHtml(bookmark));
};

const renderError = error => {
  $('#alert-container').html(generateErrorHtml(error));
  $('.error-close').focus();
  clickCloseError();
};

const setupEventListners = () => {
  clickNewBookmark();
  clickFilterBookmark();
  clickExpandBookmark();
};

const main = () => {
  Store.populateStore()
    .then(() => renderHome())
    .then(() => setupEventListners())
    .catch(error => renderError(error));
  Store.setFilterRating(1);
};

$(main);

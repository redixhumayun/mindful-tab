var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * Entry point for the React app
 */
function PopUp() {
  var _React$useState = React.useState('current'),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      navTab = _React$useState2[0],
      setNavTab = _React$useState2[1];

  var content = void 0;
  if (navTab === 'current') {
    content = React.createElement(CurrentTabContent, null);
  } else if (navTab === 'categories') {
    content = React.createElement(CategoriesTabContent, null);
  }

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      'div',
      null,
      'Icons made by ',
      React.createElement(
        'a',
        { href: 'https://www.flaticon.com/authors/kiranshastry', title: 'Kiranshastry' },
        'Kiranshastry'
      ),
      ' from ',
      React.createElement(
        'a',
        { href: 'https://www.flaticon.com/', title: 'Flaticon' },
        'www.flaticon.com'
      )
    ),
    React.createElement(NavBar, { navTabSelected: navTab, setNavTab: setNavTab }),
    content
  );
}

function NavBar(props) {
  var navTabSelected = props.navTabSelected,
      setNavTab = props.setNavTab;


  return React.createElement(
    'nav',
    { id: 'popup-menu' },
    React.createElement(
      'ul',
      null,
      React.createElement(
        'li',
        null,
        React.createElement(
          'a',
          { className: navTabSelected === 'current' ? 'selected' : '', onClick: function onClick() {
              return setNavTab('current');
            } },
          'Current Tab'
        )
      ),
      React.createElement(
        'li',
        null,
        React.createElement(
          'a',
          { className: navTabSelected === 'categories' ? 'selected' : '', onClick: function onClick() {
              return setNavTab('categories');
            } },
          'Categories'
        )
      )
    )
  );
}

/**
 * Content that is displayed when a user picks the Current tab in the pop up
 */
function CurrentTabContent() {
  var _React$useState3 = React.useState(),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      url = _React$useState4[0],
      setUrl = _React$useState4[1];

  var _React$useState5 = React.useState(''),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      category = _React$useState6[0],
      setCategory = _React$useState6[1];

  React.useEffect(function () {
    fetchCurrentUrl().then(function (data) {
      setUrl(data);
    });
    fetchCurrentCategory().then(function (category) {
      setCategory(category);
    });
  });

  return React.createElement(
    'div',
    { className: 'current-tab-content' },
    React.createElement(
      'p',
      null,
      'This tab is categorized as:'
    ),
    React.createElement(
      'h2',
      { className: 'current-tab-header' },
      category
    )
  );
}

/**
 * Content that is displayed when a user picks the Categories tab in the pop up
 */
function CategoriesTabContent() {
  var _React$useState7 = React.useState([]),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      data = _React$useState8[0],
      setData = _React$useState8[1];

  React.useEffect(function () {
    fetchCategories().then(function (data) {
      setData(data);
    });
  }, []);
  return React.createElement(
    'div',
    { className: 'category-wrapper' },
    data.map(function (category) {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(
          'h3',
          null,
          category
        ),
        React.createElement('img', { src: '' + chrome.runtime.getURL('/images/delete-icon.svg') })
      );
    })
  );
}

/**
 * Get the url that is currently entered for the tab
 */
function fetchCurrentUrl() {
  return new Promise(function (resolve, reject) {
    return chrome.tabs.query({ active: true, currentWindow: true }, function tabQueryCallback(tabs) {
      var url = tabs[0].url;
      resolve(url);
    });
  });
}

/**
 * Get the category that the current tab has been assigned to
 * First, fetch the id of the current tab
 * Next, check the tabCategories object from localStorage for the tab id
 */
function fetchCurrentCategory() {
  return new Promise(function (resolve, reject) {
    fetchCurrentTabId().then(function (tabId) {
      fetchTabCategories().then(function (tabCategories) {
        var filteredTabCategory = tabCategories.filter(function (tabCategoryObj) {
          return tabCategoryObj.id === tabId;
        });
        if (filteredTabCategory.length > 0) {
          resolve(filteredTabCategory[0].category);
        } else {
          resolve('');
        }
      }).catch(function (err) {
        reject(err);
      });
    }).catch(function (err) {
      reject(err);
    });
  });
}

/**
 * Get the categories that have been assigned to all tabs in tabCategories object
 */
function fetchTabCategories() {
  return new Promise(function (resolve, reject) {
    chrome.storage.sync.get('tabCategories', function getterCallback(data) {
      var tabCategories = data.tabCategories;

      resolve(tabCategories);
    });
  });
}

/**
 * Get the id of the current tab that the popup has been opened in
 */
function fetchCurrentTabId() {
  return new Promise(function (resolve, reject) {
    chrome.tabs.query({ active: true, currentWindow: true }, function tabQueryCallback(tabs) {
      var id = tabs[0].id;
      resolve(id);
    });
  });
}

/**
 * Get all the categories that have been set up by the user
 */
function fetchCategories() {
  return new Promise(function (resolve, reject) {
    return chrome.storage.sync.get('categories', function getterCallback(data) {
      var categories = data.categories;

      resolve(categories);
    });
  });
}

var domContainer = document.querySelector('#popup-display');
ReactDOM.render(React.createElement(PopUp), domContainer);
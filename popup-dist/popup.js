var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

function CurrentTabContent() {
  var _React$useState3 = React.useState(),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      data = _React$useState4[0],
      setData = _React$useState4[1];

  React.useEffect(function () {
    fetchCurrentUrl().then(function (data) {
      setData(data);
    });
  });

  return React.createElement(
    'p',
    null,
    data
  );
}

function CategoriesTabContent() {
  var _React$useState5 = React.useState([]),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      data = _React$useState6[0],
      setData = _React$useState6[1];

  React.useEffect(function () {
    fetchCurrentCategories().then(function (data) {
      setData(data);
    });
  });

  return React.createElement(
    'ul',
    null,
    data.map(function (category) {
      return React.createElement(
        'li',
        null,
        category
      );
    })
  );
}

function fetchCurrentUrl() {
  return new Promise(function (resolve, reject) {
    return chrome.tabs.query({ active: true, currentWindow: true }, function tabQueryCallback(tabs) {
      var url = tabs[0].url;
      resolve(url);
    });
  });
}

function fetchCurrentCategories() {
  console.log('Fetching current categories');
  return new Promise(function (resolve, reject) {
    return chrome.storage.sync.get('categories', function getterCallback(data) {
      console.log(data);
      var categories = data.categories;

      resolve(categories);
    });
  });
}

var domContainer = document.querySelector('#popup-display');
ReactDOM.render(React.createElement(PopUp), domContainer);
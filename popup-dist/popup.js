var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
function CurrentTabContent(props) {
  var _React$useState3 = React.useState(),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      url = _React$useState4[0],
      setUrl = _React$useState4[1];

  var _React$useState5 = React.useState(''),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      category = _React$useState6[0],
      setCategory = _React$useState6[1];

  /**
   * Get the categories that have been assigned to all tabs in tabCategories object
   * Filter out all the null values from the array
   * NOTE: Need to figure out why there are null values in the array
   */


  function fetchTabCategories() {
    return new Promise(function (resolve, reject) {
      chrome.storage.sync.get('tabCategories', function getterCallback(data) {
        var tabCategories = data.tabCategories;

        var filteredTabCategories = tabCategories.map(function (tabCategoryObj) {
          if (tabCategoryObj !== null) {
            return tabCategoryObj;
          }
          return null;
        }).filter(function (tabCategoryObj) {
          return tabCategoryObj;
        }); //  implicitly converts each value to Boolean and returns truthy values
        resolve(filteredTabCategories);
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
  * Get the category that the current tab has been assigned to
  * First, fetch the id of the current tab
  * Next, check the tabCategories object from localStorage for the tab id
  */
  function fetchCategoryForCurrentTab() {
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
   * Get the url that is currently entered for the tab
   */
  function fetchCurrentUrl() {
    return new Promise(function (resolve, reject) {
      try {
        return chrome.tabs.query({ active: true, currentWindow: true }, function tabQueryCallback(tabs) {
          var url = tabs[0].url;
          resolve(url);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  React.useEffect(function () {
    fetchCurrentUrl().then(function (data) {
      setUrl(data);
    });
    fetchCategoryForCurrentTab().then(function (category) {
      setCategory(category);
    });
  }, []);

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
 * Component that is displayed when a user picks the Categories tab in the pop up
 */
function CategoriesTabContent(props) {
  var _React$useState7 = React.useState([]),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      categories = _React$useState8[0],
      setCategories = _React$useState8[1];

  var makeFetchCategoriesApiCall = function makeFetchCategoriesApiCall() {
    return fetchCategories().then(function (data) {
      return data;
    });
  };

  React.useEffect(function () {
    makeFetchCategoriesApiCall().then(function (data) {
      setCategories(data);
    });
  }, []);

  /**
  * Function that iterates over the tabCategories array and
  * @param {String[]} categories the array of strings that represent user defined categories
  * @param {String} category the single category that the user has chosen to delete
  */
  function deleteCategoryFromCategories(categories, category) {
    return categories.map(function categoriesMapper(cat) {
      if (cat !== category) {
        return cat;
      }
    }).filter(function (category) {
      if (category !== null || category !== undefined) {
        return category;
      }
    });
  }

  var deleteCategoryClickHandler = function deleteCategoryClickHandler(category) {
    fetchCategories().then(function (categories) {
      var updatedCategories = deleteCategoryFromCategories(categories, category);
      updateCategoriesInLocalStorage(updatedCategories).then(function (response) {
        makeFetchCategoriesApiCall().then(function (data) {
          setCategories(data);
        });
      }).catch(function (err) {
        throw err;
      });
    });
  };

  var newCategoryAdded = function newCategoryAdded() {
    makeFetchCategoriesApiCall().then(function (categories) {
      setCategories(categories);
    });
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      'div',
      { className: 'category-wrapper' },
      categories.map(function (category, index) {
        return React.createElement(
          React.Fragment,
          { key: category + ' + ' + index },
          React.createElement(
            'h3',
            null,
            category
          ),
          React.createElement('img', { src: '' + chrome.runtime.getURL('/images/delete-icon.svg'),
            onClick: function onClick() {
              return deleteCategoryClickHandler(category);
            } })
        );
      })
    ),
    React.createElement(AddNewCategory, { newCategoryAdded: newCategoryAdded })
  );
}

/**
 * Component that is used to display the new category UI that will allow
 * users to add a new category
 * @param {Object} props 
 */
function AddNewCategory(props) {
  var _React$useState9 = React.useState(false),
      _React$useState10 = _slicedToArray(_React$useState9, 2),
      addingCategory = _React$useState10[0],
      setAddingCategory = _React$useState10[1];

  var _React$useState11 = React.useState(''),
      _React$useState12 = _slicedToArray(_React$useState11, 2),
      newCategory = _React$useState12[0],
      setNewCategory = _React$useState12[1];

  var _React$useState13 = React.useState(false),
      _React$useState14 = _slicedToArray(_React$useState13, 2),
      categoryExistsError = _React$useState14[0],
      setCategoryExistsError = _React$useState14[1];

  var _React$useState15 = React.useState(''),
      _React$useState16 = _slicedToArray(_React$useState15, 2),
      inputError = _React$useState16[0],
      setInputError = _React$useState16[1];

  /**
   * Function that is called when user attempts to add a new category
   * Function will check whether the category being added already exists
   */


  var addNewCategory = function addNewCategory() {
    //  Check if this category already exists
    fetchCategories().then(function (categories) {
      var doesCategoryAlreadyExist = categories.some(function (category) {
        return category.toLowerCase() === newCategory.toLowerCase();
      });
      if (doesCategoryAlreadyExist === true) {
        setCategoryExistsError(true);
        setInputError('This category alrady exists');
        return;
      }

      var updatedCategories = [].concat(_toConsumableArray(categories), [newCategory]);
      updateCategoriesInLocalStorage(updatedCategories).then(function (response) {
        setNewCategory('');
        setAddingCategory(false);
        props.newCategoryAdded();
      });
    });
  };

  //  Decide which content to render based on state of addingCategory
  var content = void 0;

  if (addingCategory === false) {
    content = React.createElement(
      'button',
      { id: 'add-category-btn', onClick: function onClick() {
          return setAddingCategory(true);
        } },
      'Add Category'
    );
  } else if (addingCategory === true) {
    content = React.createElement(
      React.Fragment,
      null,
      React.createElement('input', { className: categoryExistsError ? 'error' : null, id: 'new-category', type: 'text',
        onChange: function onChange(e) {
          return setNewCategory(e.target.value);
        },
        value: newCategory }),
      React.createElement(
        'label',
        { htmlFor: 'new-category' },
        inputError
      ),
      React.createElement(
        'div',
        { id: 'add-category-btns-container' },
        React.createElement(
          'button',
          { onClick: function onClick() {
              return setAddingCategory(false);
            } },
          'Cancel'
        ),
        React.createElement(
          'button',
          { onClick: addNewCategory },
          'Done'
        )
      )
    );
  }

  return React.createElement(
    React.Fragment,
    null,
    content
  );
}

/**
 * The function that will set the new categories in local storage
 * @param {String[]} categories 
 */
function updateCategoriesInLocalStorage(categories) {
  return new Promise(function (resolve, reject) {
    try {
      chrome.storage.sync.set({ 'categories': categories }, function storageSetterCallback() {
        resolve(true);
      });
    } catch (err) {
      reject(err);
    }
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
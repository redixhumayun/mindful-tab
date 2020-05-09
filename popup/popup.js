/**
 * Entry point for the React app
 */
function PopUp() {
  const [navTab, setNavTab] = React.useState('current')

  let content
  if (navTab === 'current') {
    content = <CurrentTabContent />
  } else if (navTab === 'categories') {
    content = <CategoriesTabContent />
  }

  return (
    <React.Fragment>
      <NavBar navTabSelected={navTab} setNavTab={setNavTab} />
      {content}
      {/* <div style={{ fontSize: '0.75em' }}>Icons made by <a href="https://www.flaticon.com/authors/kiranshastry" title="Kiranshastry">Kiranshastry</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div> */}
    </React.Fragment>
  )
}

function NavBar(props) {
  const { navTabSelected, setNavTab } = props

  return (
    <nav id='popup-menu'>
      <ul>
        <li><a className={navTabSelected === 'current' ? 'selected' : ''} onClick={() => setNavTab('current')}>Current Tab</a></li>
        <li><a className={navTabSelected === 'categories' ? 'selected' : ''} onClick={() => setNavTab('categories')}>Categories</a></li>
      </ul>
    </nav>
  )
}

/**
 * Content that is displayed when a user picks the Current tab in the pop up
 */
function CurrentTabContent() {
  const [url, setUrl] = React.useState()
  const [category, setCategory] = React.useState('')

  /**
   * Get the categories that have been assigned to all tabs in tabCategories object
   * Filter out all the null values from the array
   * NOTE: Need to figure out why there are null values in the array
   */
  function fetchTabCategories() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get('tabCategories', function getterCallback(data) {
        const { tabCategories } = data
        const filteredTabCategories = tabCategories.map(tabCategoryObj => {
          if (tabCategoryObj !== null) {
            return tabCategoryObj
          }
          return null
        }).filter(tabCategoryObj => tabCategoryObj) //  implicitly converts each value to Boolean and returns truthy values
        resolve(filteredTabCategories)
      })
    })
  }

  /**
   * Get the id of the current tab that the popup has been opened in
   */
  function fetchCurrentTabId() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function tabQueryCallback(tabs) {
        const id = tabs[0].id
        resolve(id)
      })
    })
  }

  /**
 * Get the category that the current tab has been assigned to
 * First, fetch the id of the current tab
 * Next, check the tabCategories object from localStorage for the tab id
 */
  function fetchCategoryForCurrentTab() {
    return new Promise((resolve, reject) => {
      fetchCurrentTabId().then(tabId => {
        fetchTabCategories().then(tabCategories => {
          const filteredTabCategory = tabCategories.filter(tabCategoryObj => tabCategoryObj.id === tabId)
          if (filteredTabCategory.length > 0) {
            resolve(filteredTabCategory[0].category)
          } else {
            resolve('')
          }
        }).catch(err => {
          reject(err)
        })
      }).catch(err => {
        reject(err)
      })
    })
  }

  /**
   * Get the url that is currently entered for the tab
   */
  function fetchCurrentUrl() {
    return new Promise((resolve, reject) => {
      try {
        return chrome.tabs.query({ active: true, currentWindow: true }, function tabQueryCallback(tabs) {
          const url = tabs[0].url
          resolve(url)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  React.useEffect(() => {
    fetchCurrentUrl().then(data => {
      setUrl(data)
    })
    fetchCategoryForCurrentTab().then(category => {
      setCategory(category)
    })
  }, [])

  return (
    <div className='current-tab-content'>
      {/* <p>{url}</p> */}
      <p>This tab is categorized as:</p>
      <h2 className='current-tab-header'>{category}</h2>
    </div>
  )
}

/**
 * Component that is displayed when a user picks the Categories tab in the pop up
 */
function CategoriesTabContent() {
  const [categories, setCategories] = React.useState([])

  const makeFetchCategoriesApiCall = () => {
    return fetchCategories().then(data => {
      return data
    })
  }

  React.useEffect(() => {
    makeFetchCategoriesApiCall().then(data => {
      setCategories(data)
    })
  }, [])

  /**
 * Function that iterates over the tabCategories array and
 * @param {String[]} categories the array of strings that represent user defined categories
 * @param {String} category the single category that the user has chosen to delete
 */
  function deleteCategoryFromCategories(categories, category) {
    return categories.map(function categoriesMapper(cat) {
      if (cat !== category) {
        return cat
      }
    }).filter(category => {
      if ((category !== null || category !== undefined)) {
        return category
      }
    })
  }


  const deleteCategoryClickHandler = (category) => {
    fetchCategories().then(categories => {
      const updatedCategories = deleteCategoryFromCategories(categories, category)
      updateCategoriesInLocalStorage(updatedCategories).then(response => {
        makeFetchCategoriesApiCall().then(data => {
          setCategories(data)
        })
      }).catch(err => { throw err })
    })
  }

  return (
    <React.Fragment>
      <div className='category-wrapper'>
        {
          categories.map((category, index) => {
            return (
              <React.Fragment key={`${category} + ${index}`}>
                <h3>{category}</h3>
                <img src={`${chrome.runtime.getURL('/images/delete-icon.svg')}`}
                  onClick={() => deleteCategoryClickHandler(category)} />
              </React.Fragment>
            )
          })
        }
      </div>
      <button id='add-category-btn'>Add Category</button>
    </React.Fragment>
  )
}

/**
 * The function that will set the new categories in local storage
 * @param {String[]} categories 
 */
function updateCategoriesInLocalStorage(categories) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.set({ 'categories': categories }, function storageSetterCallback() {
        resolve(true)
      })
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Get all the categories that have been set up by the user
 */
function fetchCategories() {
  return new Promise((resolve, reject) => {
    return chrome.storage.sync.get('categories', function getterCallback(data) {
      const { categories } = data
      resolve(categories)
    })
  })
}

const domContainer = document.querySelector('#popup-display')
ReactDOM.render(React.createElement(PopUp), domContainer)
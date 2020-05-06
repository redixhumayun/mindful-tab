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
      <div>Icons made by <a href="https://www.flaticon.com/authors/kiranshastry" title="Kiranshastry">Kiranshastry</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
      <NavBar navTabSelected={navTab} setNavTab={setNavTab} />
      {content}
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
  React.useEffect(() => {
    fetchCurrentUrl().then(data => {
      setUrl(data)
    })
    fetchCurrentCategory().then(category => {
      setCategory(category)
    })
  })

  return (
    <div className='current-tab-content'>
      {/* <p>{url}</p> */}
     <p>This tab is categorized as:</p> 
      <h2 className='current-tab-header'>{category}</h2>
    </div>
  )
}

/**
 * Content that is displayed when a user picks the Categories tab in the pop up
 */
function CategoriesTabContent() {
  const [data, setData] = React.useState([])
  React.useEffect(() => {
    fetchCategories().then(data => {
      setData(data)
    })
  }, [])
  console.log(chrome.runtime.getURL('delete-icon.svg'))
  return (
    <ul>
      {
        data.map(category => {
          return (
            <div key={`${category}`} className='category-div'>
              <li>{category}</li>
              {/* <button>Remove</button> */}
              {/* <button><img src="chrome-extension://phjkhgfhkipgkdjanfgaaijkohlaneeh/delete-icon.svg" /></button> */}
              <button><img src={`${chrome.runtime.getURL('delete-icon.svg')}`} /></button>
            </div>
          )
        })
      }
    </ul>
  )
}

/**
 * Get the url that is currently entered for the tab
 */
function fetchCurrentUrl() {
  return new Promise((resolve, reject) => {
    return chrome.tabs.query({ active: true, currentWindow: true }, function tabQueryCallback(tabs) {
      const url = tabs[0].url
      resolve(url)
    })
  })
}

/**
 * Get the category that the current tab has been assigned to
 * First, fetch the id of the current tab
 * Next, check the tabCategories object from localStorage for the tab id
 */
function fetchCurrentCategory() {
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
 * Get the categories that have been assigned to all tabs in tabCategories object
 */
function fetchTabCategories() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('tabCategories', function getterCallback(data) {
      const { tabCategories } = data
      resolve(tabCategories)
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
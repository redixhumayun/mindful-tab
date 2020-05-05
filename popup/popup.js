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
      {/* <Content navTabSelected={navTab} /> */}
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

function CurrentTabContent() {
  const [data, setData] = React.useState()
  React.useEffect(() => {
    fetchCurrentUrl().then(data => {
      setData(data)
    })
  })

  return <p>{data}</p>
}

function CategoriesTabContent() {
  const [data, setData] = React.useState([])
  React.useEffect(() => {
    fetchCurrentCategories().then(data => {
      setData(data)
    })
  })

  return (
    <ul>
      {
        data.map(category => {
          return <li>{category}</li>
        })
      }
    </ul>
  )
}

function fetchCurrentUrl() {
  return new Promise((resolve, reject) => {
    return chrome.tabs.query({ active: true, currentWindow: true }, function tabQueryCallback(tabs) {
      const url = tabs[0].url
      resolve(url)
    })
  })
}

function fetchCurrentCategories() {
  console.log('Fetching current categories')
  return new Promise((resolve, reject) => {
    return chrome.storage.sync.get('categories', function getterCallback(data) {
      console.log(data)
      const { categories } = data
      resolve(categories)
    })
  })
}

const domContainer = document.querySelector('#popup-display')
ReactDOM.render(React.createElement(PopUp), domContainer)
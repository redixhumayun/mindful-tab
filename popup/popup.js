// (function setUp() {
//   addClickListenerToAnchorTags()
//   getCurrentlySelectedAnchorTag()
// })()

// const categoryDiv = document.getElementById('category')

// function addClickListenerToAnchorTags() {
//   const anchors = document.getElementsByTagName('a')
//   for(let i = 0; i < anchors.length; i++) {
//     anchors[i].addEventListener('click', anchorClickHandler, false)
//   }
// }

// function anchorClickHandler(event) {
//   const anchors = document.getElementsByTagName('a')
//   for(let i = 0; i < anchors.length; i++) {
//     anchors[i].classList.remove('selected')
//   }
//   const elem = event.target
//   elem.classList.add('selected')
//   getCurrentlySelectedAnchorTag()
// }

// function getCurrentlySelectedAnchorTag() {
//   const anchors = document.getElementsByTagName('a')
//   for(let i = 0; i < anchors.length; i++) {
//     if (anchors[i].className === 'selected') {
//       displayUiBasedOnSelectedTag(anchors[i].innerText)
//     }
//   }
// }

function PopUp() {
  const [navTab, setNavTab] = React.useState('current')
  console.log(navTab)
  return (
    <React.Fragment>
      <NavBar navTabSelected={navTab} setNavTab={setNavTab} />
      <Content navTabSelected={navTab} />
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

// function displayUiBasedOnSelectedTag(anchorTag) {
//   const popupWrapper = document.getElementById('popup-wrapper')
//   while(popupWrapper.firstChild) {
//     popupWrapper.removeChild(popupWrapper.firstChild)
//   }
//   switch(anchorTag) {
//     case 'Current Tab':
//       return displayCurrentTabUi()
//     case 'Categories':
//       return displayCategoriesUi()
//     default:
//       return
//   }
// }

function Content(props) {
  const { navTabSelected } = props
  const [data, setData] = React.useState()

  React.useEffect(async () => {
    if (navTabSelected === 'Current Tab') {
      const data = await fetchCurrentUrl()
      setData(data)
    } else if (navTabSelected === 'Categories') {
      const data = await fetchCurrentCategories()
      setData(data)
    } else {
      throw new Error('There was an unidentified tab that was picked')
    }
  })

  switch (navTabSelected) {
    case 'Current Tab':
      return ( <p>{data}</p> )
    case 'Categories':
      return (
        <ul>
          {
            data.map(category => {
              return <li>{category}</li>
            })
          }
        </ul>
      )
    default:
      return null
  }
}

function fetchCurrentUrl() {
  return new Promise((resolve, reject) => {
    return chrome.tabs.query({ active: true, lastFocusedWindow: true }, function tabQueryCallback(tabs) {
      const url = tabs[0].url
      resolve(url)
    })
  })
}

function fetchCurrentCategories() {
  return new Promise((resolve, reject) => {
    return chrome.storage.sync.get('categories', function getterCallback(data) {
      const { categories } = data
      resolve(categories)
    })
  })
}

// function displayCurrentTabUi() {
//   chrome.tabs.query({ active: true, lastFocusedWindow: true }, function tabQueryCallback(tabs) {
//     const url = tabs[0].url
//     const popupWrapper = document.getElementById('popup-wrapper')
//     const div = document.createElement('div')
//     div.innerText = url
//     popupWrapper.appendChild(div)
//   })
// }

// function displayCategoriesUi() {
//   chrome.storage.sync.get('categories', function getterCallback(data) {
//     const { categories } = data
//     const popupWrapper = document.getElementById('popup-wrapper')
//     const div = document.createElement('div')
//     const listElem = document.createElement('ul')
//     categories.map(category => {
//       const listItem = document.createElement('li')
//       listItem.innerText = category
//       listElem.appendChild(listItem)
//     })
//     popupWrapper.appendChild(div)
//     div.append(listElem)
//   })
// }

const domContainer = document.querySelector('#popup-display')
ReactDOM.render(React.createElement(PopUp), domContainer)
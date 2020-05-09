/**
 * IIFE that runs and sets up the categories and displays them initially
 */
(async function () {
  let categories = []
  try {
    categories = await getStoredCategories()
  } catch (err) {
    throw err
  }
  showCategories(categories)
  addClickHandlerToButtons()
})()

/**
 * Fetch all the categories stored in localStorage
 */
async function getStoredCategories() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['categories'], function getterCallback(result) {
      const { categories } = result
      resolve(categories)
    })
  })
}

/**
 * Display the categories to the user in the UI
 * @param {String[]} categories 
 */
function showCategories(categories) {
  const btnsContainer = document.getElementById('buttons-container')
  categories.map(category => {
    const btnElem = document.createElement('button')
    btnElem.className = 'category-btn'
    btnElem.innerText = category
    btnsContainer.appendChild(btnElem)
  })
}

/**
 * Add a click event listener to all the buttons
 */

function addClickHandlerToButtons() {
  const elems = document.getElementsByClassName('category-btn')
  for (let i = 0; i < elems.length; i++) {
    elems[i].addEventListener('click', clickHandler, false)
  }
}

/**
 * Click handler for the category buttons
 * @param {Object} event 
 */
async function clickHandler(event) {
  const btnClicked = event.target.innerText
  try {
    const id = await getCurrentTabId()
    await updateCategoryForTabsInStorage(btnClicked, id)
    removeOverlay()
  } catch (err) {
    throw err
  }
}

function getCurrentTabId() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function tabQueryCallback(tabs) {
      const id = tabs[0].id
      resolve(id)
    })
  })
}

/**
 * Sets the category for a specific tab in storage
 * @param {String} category 
 * @param {String} id
 */
async function updateCategoryForTabsInStorage(category, id) {
  let categoriesForTabs = []
  try {
    categoriesForTabs = await getCategoriesForTabsInStorage()
  } catch (err) {
    throw err
  }
  return new Promise((resolve, reject) => {
    let updatedCategoriesForTabs = []

    /**
     * Check if the tab id already exists in the tabCategories object
     * If it does not, push a new object
     * If it does, map the tabCategories object and update the relevant object
     */
    const doesIdExist = categoriesForTabs.some(categoryTabObj => categoryTabObj.id === id)
    if (!doesIdExist) {
      updatedCategoriesForTabs = [...categoriesForTabs, { category, id }]
    } else {
      updatedCategoriesForTabs = categoriesForTabs.map(categoryTabObj => {
        if (categoryTabObj.id === id) {
          return Object.assign({}, { ...categoryTabObj }, { category, id })
        }
        return categoryTabObj
      })
    }

    try {
      chrome.storage.sync.set({ 'tabCategories': updatedCategoriesForTabs }, function storageSetterCallback() {
        resolve(true)
      })
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Function that fetches the current tabCategories value from localStorage
 * @return {Array<Object>} 
 */
async function getCategoriesForTabsInStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['tabCategories'], function storageSyncGetterCallback(data) {
      const { tabCategories } = data
      if (!tabCategories) {
        return resolve([])
      }
      return resolve(tabCategories)
    })
  })
}

/**
 * Removes the category overlay once it has been selected
 */
function removeOverlay() {
  document.getElementById('overlay').remove()
}
/**
 * IIFE that runs and sets up the categories and displays them initially
 */
(async function() {
  let categories = []
  try {
    categories = await getStoredCategories()
  } catch(err) {
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
    await setCategoryInStorage(btnClicked)
    removeOverlay()
  } catch(err) {
    throw err
  }
}

/**
 * Sets the category for a specific tab in storage
 * @param {String} category 
 */
async function setCategoryInStorage(category) {
  return new Promise(function returningPromise(resolve, reject) {
    try {
      chrome.storage.sync.set({ 'category': category }, function storageSyncCallback() {
        resolve(true)
      })
    } catch(err) {
      reject(err)
    }
  })
}

/**
 * Removes the category overlay once it has been selected
 */
function removeOverlay() {
  document.getElementById('overlay').remove()
}
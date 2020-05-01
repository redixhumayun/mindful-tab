addClickHandlerToButtons()

/**
 * Add a click event listener to all the buttons
 */
function addClickHandlerToButtons() {
  const elems = document.getElementsByClassName('category-btn')
  for (let i = 0; i < elems.length; i++) {
    elems[i].addEventListener('click', clickHandler, false)
  }
}

async function clickHandler(event) {
  const btnClicked = event.target.innerText
  try {
    await setCategoryInStorage(btnClicked)
    removeOverlay()
  } catch(err) {
    throw err
  }
}

async function setCategoryInStorage(category) {
  return new Promise(function returningPromise(resolve, reject) {
    try {
      chrome.storage.sync.set({ 'category': category }, function storageSyncCallback() {
        console.log('Category set')
        resolve(true)
      })
    } catch(err) {
      reject(err)
    }
  })
}

function removeOverlay() {
  document.getElementById('overlay').remove()
}
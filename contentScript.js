/**
 * Fetch the contentScript.html and display it in the browser
 */
// fetch(chrome.runtime.getURL('contentScript.html'))
//   .then(response => {
//     return response.text()
//   })
//   .then(data => {
//     const node = new DOMParser().parseFromString(data, 'text/html').body.firstElementChild;
//     document.body.append(node)
//     addClickHandlerToButtons()
//   })
//   .catch(err => {
//     throw err
//   })
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

function clickHandler(event) {
  const btnClicked = event.target.innerText
  removeOverlay()
}

function removeOverlay() {
  document.getElementById('overlay').remove()
}

// chrome.runtime.onConnect.addListener(function portListener(port) {
//   port.onMessage.addListener(function messageReceiver(msg) {
//     console.log(msg)
//   })
// })
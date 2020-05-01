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
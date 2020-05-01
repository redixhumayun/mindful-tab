// chrome.tabs.onCreated.addListener(function newTabListener(tab) {
//   const { id, url, pendingUrl } = tab

//   //  This extension will not run on the default chrome new tab
//   //  It will allow the user to enter a URL first before picking a reason for the tab
  
//   //  NOTE: Chrome does not allow script execution on its default newtab. Find a solution
//   //  to this in case of future feature requirement
//   if (url === "chrome://newtab/" || pendingUrl === "chrome://newtab/") {
//     return
//   }
  
//   chrome.tabs.executeScript(id, { file: 'contentScript.js' }, function callback() {
//     setUpPortConnectionToTab(id)
//   })
// })

// chrome.tabs.onUpdated.addListener(function tabUpdatedListener(tabId, changeInfo, tab) {
  
// })

// function setUpPortConnectionToTab(tabId) {
//   const port = chrome.tabs.connect(tabId)
//   port.postMessage({ displayPopup: true })
//   port.onMessage.addListener(function messageReceiver(response) {
//     console.log(response)
//   })
// }

const elems = document.getElementsByClassName('category-btn')
for (let i = 0; i < elems.length; i++) {
  elems[i].addEventListener('click', clickHandler, false)
}

function clickHandler(event) {
  const btnClicked = event.target.innerText
  removeOverlay()
}

function removeOverlay() {
  document.getElementById('overlay').remove()
}
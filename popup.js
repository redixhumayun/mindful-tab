const urlDiv = document.getElementById('url')
const categoryDiv = document.getElementById('category')

chrome.tabs.query({ active: true, lastFocusedWindow: true }, function tabQueryCallback(tabs) {
  const url = tabs[0].url
  urlDiv.innerText = url
})

chrome.storage.sync.get('category', function getSyncDataCallback(data) {
  const { category } = data
  categoryDiv.innerText = category
})
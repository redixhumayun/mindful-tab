/**
 * Add an event listener that will check for when the extension is first
 * installed. In that situation, add the default categories to the localStorage DB.
 */
chrome.runtime.onInstalled.addListener(function installationListener(details) {
  const categories = ['Working', 'Learning', 'Chilling']
  chrome.storage.sync.set({ categories: categories }, function setterCallback() {
    console.log('Default categories have been set on first install')
  })
})
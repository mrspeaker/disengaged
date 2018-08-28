/* global browser */

let currentDomain;
let currentUrlKey;
let currentState;

(function init() {
  document.getElementById('toggle-for-site').addEventListener('click', (e) => {
    browser.runtime.sendMessage({ id: 'toggle' });
  });
})();

browser.tabs
  .query({ active: true, currentWindow: true })
  .then((tabs) => {
    currentDomain = getDomainFromUrl(tabs[0].url);
    return browser.runtime.sendMessage({ id: 'fetch-url-key', url: currentDomain });
  })
  .then((response) => {
    currentUrlKey = response;
    return browser.storage.local.get();
  })
  .then((localStorage) => {
    currentState = fetchUrlState(currentUrlKey, localStorage);
    updateHtmlBindings();
  });

function updateHtmlBindings() {
  const $currentSite = document.getElementById('current-site');
  $currentSite.textContent = currentDomain;

  const $currentState = document.getElementById('current-state');
  $currentState.textContent = `${currentState.found} ${currentState.exists} ${currentState.state}`;
}

// ## Helper Functions

/**
 * If the url is not found, the plugin does not support the site.
 * Returns { found: false, exists: false, state: false }.
 *
 * If the url is not present in storage, this is the first time visiting the url.
 * Returns { found: true, exists: false, state: false }
 *
 * If the url is in storage, return whether the plugin is enabled or not.
 * Returns { found: true, exists: true, state: true|false }
 *
 * @param {String} urlKey the `matches` key from the content scripts config
 * @param {browser.storage.StorageArea} localStorage
 * @return {{ found: Boolean, exists: Boolean, state: Boolean }}
 */
function fetchUrlState(urlKey, localStorage) {
  return {
    found: !!urlKey,
    exists: localStorage.hasOwnProperty(urlKey),
    state: !!localStorage[urlKey],
  };
}

function getDomainFromUrl(url) {
  const a = document.createElement('a');
  a.setAttribute('href', url);
  return `${a.protocol}//${a.hostname}`;
}

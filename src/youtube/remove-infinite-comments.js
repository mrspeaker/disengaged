/* global MutationObserver */

/**
 * Remove the component triggering ajax requests for more comments
 * @see A.2
 */
(function removeInfiniteComments () {
  const ytApp = document.querySelector('ytd-app')
  if (ytApp) {
    const observer = new MutationObserver(() => {
      // Make sure the first page of comments has loaded
      const comments = document.querySelector('ytd-comments div#contents')
      if (!comments || comments.childElementCount === 0) { return }

      // Remove the component powering the infinite scroll
      const cont = document.querySelector('ytd-comments div#continuations')
      if (!cont) { return }
      cont.parentNode.removeChild(cont)

      observer.disconnect()
    })
    observer.observe(ytApp, { childList: true, subtree: true })
  }
})()

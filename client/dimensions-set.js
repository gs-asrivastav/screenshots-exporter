(() => {
  let maxHeight = 0
  let maxWidth = 0
  document.querySelectorAll('gridster-item')
    .forEach((el) => {
      if (maxHeight < el.getBoundingClientRect().bottom) {
        maxHeight = el.getBoundingClientRect().bottom
      }
      if (maxWidth < el.getBoundingClientRect().right) {
        maxWidth = el.getBoundingClientRect().right
      }
    })
  // Set to window's context.
  window.maxWidth = maxWidth
  window.maxHeight = maxHeight

  console.info(`Setting maxWidth value as ${maxWidth}`);
  console.info(`Setting maxHeight value as ${maxHeight}`);
})();

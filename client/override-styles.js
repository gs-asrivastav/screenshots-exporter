window.updateStyleByXPath = function (selector) {
  let element = document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  if (element !== null && element !== undefined) {
    element.style.maxHeight = '';
  }
};

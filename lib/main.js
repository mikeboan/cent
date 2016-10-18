const DOMNodeCollection = require("./dom_node_collection.js");

const completionCallbacks = [];

window.$cent = function (arg) {
  if (typeof arg === "string") {
    // arg is CSS selector
    return new DOMNodeCollection(
      Array.from(document.querySelectorAll(arg))
    );
  } else if (arg instanceof HTMLElement) {
    // arg is HTMLElement
    return new DOMNodeCollection([arg]);
  } else if (arg instanceof Function) {
    // arg is function
    if (document.readyState === "complete") {
      arg();
    } else {
      completionCallbacks.push(arg);
    }
  }
};

/**
*  Merge POJOs, giving precedence to later of two args with
*  same keys
*/
window.$cent.extend = function(objA, ...objects) {
  objects.forEach( obj => {
    for (let key in obj) { objA[key] = obj[key]; }
  });
  return objA;
};

/**
*  Send ajax request
*/
window.$cent.ajax = function(options) {
  const defaults = {
    type: "GET",
    url: document.URL,
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    success: function () {},
    error: function () {},
  };

  const requestParams = window.$cent.extend(defaults, options);

  const xhr = new XMLHttpRequest();
  xhr.open(requestParams.type, requestParams.url);
  xhr.onload = requestParams.success;
  xhr.send(JSON.stringify(requestParams.data));
};

document.addEventListener("DOMContentLoaded", () => {
  completionCallbacks.forEach( callback => callback() );
});

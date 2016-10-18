class DOMNodeCollection {
  constructor(nodes) {
    this.elementArray = Array.from(nodes);
  }

  /**
  *  Pass each element in collection into callback function
  */
  each(callback) {
    this.elementArray.forEach(el => callback(el));
  }

  /**
  *  Receives up to one argument. If argument is provided, it
  *  is assumed to be a string and is set as the innerHTML of
  *  each element in elementArray.
  *
  *  If no argument is given, the innerHTML of the first element
  *  in the elementArray is returned
  */
  html() {
    if (typeof html === "string") {
      // iterate through this.elementArray, putting argument[0] as innerHTML
      this.elementArray.forEach(el => el.innerHTML = arguments[0]);
    } else {
      // return innerHTML of this.elementArray[0]
      return this.elementArray[0].innerHTML;
    }
  }

  /**
  *  sets the innerHTML of each element in elementArray to
  *  empty string
  */
  empty() {
    this.html("");
  }

  /**
  *  inserts the specified content as the last child of each element in
  *  the $cent collection
  */
  append(appendData) {
    if (typeof appendData === "string") {
      this.each(el => {
        el.innerHTML += appendData;
      });
    } else if (appendData instanceof HTMLElement) {
      this.each(el => el.innerHTML += appendData.outerHTML);
    } else {
      this.each(el => {
        appendData.each(el2 => el.innerHTML += el2.outerHTML);
      });
    }
  }

  /**
  *  If provided one argument of type string, the value of the
  *  attribute named by the string is returned.
  *  If provided one argument of options hash (eg { attr1: val1,
  *  attr2: val2 }) each attribute and is set to the specified value.
  *  If provided two arguments, the attribute in the first argument
  *  is set to the value specified in the second argument.
  */
  attr(...args) {
    if (args.length === 1) {
      if (typeof args[0] === "string") {
        // return attribute
        return this.elementArray[0].getAttribute(args[0]);
      } else {
        // iterate over each key in options hash and recursively add attrs
        for(let attr in args[0]) {
          this.attr(attr, args[0][attr]);
        }
      }
    } else {
      // set attribute
      this.each(el => {
        el.setAttribute(args[0], args[1]);
      });
    }
  }

  /**
  *  Add class name to each element in elementArray
  */
  addClass(className) {
    let oldClass = this.attr("class");
    this.attr("class", oldClass + ' ' + className);
  }

  /**
  *  Remove class name from each element in elementArray
  */
  removeClass(className) {
    const classList = this.attr("class").split(" ");
    const newClassList = [];
    classList.forEach(oldClass => {
      if (oldClass !== className) { newClassList.push(oldClass); }
    });
    this.attr("class", newClassList.join(' '));
  }

  /**
  *  Return direct children of each item in elementArray as
  *  a new DOMNodeCollection
  */
  children() {
    const children = [];

    this.each(el => {
      for (let i = 0; i < el.children.length; i++) {
        children.push(el.children[i]);
      }
    });

    return new DOMNodeCollection(children);
  }

  /**
  *  Return direct parents of each item in elementArray as
  *  a new DOMNodeCollection
  */
  parent() {
    const parents = [];
    this.each(el => {
      if (!parents.includes(el.parentNode)) {
        parents.push(el.parentNode);
      }
    });
    return new DOMNodeCollection(parents);
  }

  /**
  *  Return new DOMNodeCollection of elements matching provided
  *  CSS selector
  */
  find(selector = "*") {
    return new DOMNodeCollection(
      Array.from(this.elementArray[0].querySelectorAll(selector))
    );
  }

  /**
  *  Remove all elements matching provided CSS selector from
  *  this collection's elementArray
  */
  remove(selector = "*") {
    const newElementArray = [];

    this.each(el => {
      if (el.matches(selector)) {
        el.parentNode.removeChild(el);
      } else {
        newElementArray.push(el);
      }
    });

    this.elementArray = newElementArray;
  }

  /**
  *  Add event handler (without event delegation) to each
  *  item in elementArray
  */
  on(type, listener) {
    this.each(el => el.addEventListener(type, listener));
  }

  /**
  *  Remove event handler from each item in elementArray
  */
  off(type, listener) {
    this.each(el => el.removeEventListener(type, listener));
  }
}

module.exports = DOMNodeCollection;

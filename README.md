# $cent
The lightweight DOM manipulation library

## In Action
Run snake.html to play Snake in-browser. This version of snake uses $cent to update the DOM in real time in response to user input.

## Features and Implementation
$cent provides convenient methods for interacting with the DOM, all centered around the DOMNodeCollection object. This object allows users to store lists of DOM nodes and operate on them via provided functions.

Sample functions include:
```javascript
/**
*  Return new DOMNodeCollection of elements matching provided
*  CSS selector
*/
find(selector = "*") {
  return new DOMNodeCollection(
    Array.from(this.elementArray[0].querySelectorAll(selector))
  );
}
```

```javascript
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
```

```javascript
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
```

## API
### each(callback)
Pass each element in collection into callback function

### html(innerHTML)
Receives up to one argument. If argument is provided, it
is assumed to be a string and is set as the innerHTML of
each element in elementArray.

If no argument is given, the innerHTML of the first element
in the elementArray is returned

### empty()
sets the innerHTML of each element in elementArray to
empty string

### append(appendData)
inserts the specified content as the last child of each element in
the $cent collection

### attr(...args)
If provided one argument of type string, the value of the
attribute named by the string is returned.
If provided one argument of options hash (eg { attr1: val1,
attr2: val2 }) each attribute and is set to the specified value.
If provided two arguments, the attribute in the first argument
is set to the value specified in the second argument.

### addClass(className)
Add class name to each element in elementArray

### hasClass(className)
Returns true if any element in element array is of class className,
false o.w.

### removeClass(className)
Remove class name from each element in elementArray

### children()
Return direct children of each item in elementArray as
a new DOMNodeCollection

### parent()
Return parent of each item in elementArray as
a new DOMNodeCollection

### find(selector = "\*")
Return new DOMNodeCollection of elements matching provided
CSS selector

### remove(selector = "\*")
Remove all elements matching provided CSS selector from
this collection's elementArray

### on(type, listener)
Add event handler (without event delegation) to each
item in elementArray

### off(type, listener)
Remove event handler from each item in elementArray

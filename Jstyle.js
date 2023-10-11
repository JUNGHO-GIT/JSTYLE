
// --------------------------------------------------------------------------------------------->
var dynamicStyle = function () {
  
  // 1. Object mapping style prefixes to corresponding CSS property and its unit
  const styles = {
    w: ["width", "%"],
    h: ["height", "%"],
    p: ["padding", "px"],
    pt: ["padding-top", "px"],
    pb: ["padding-bottom", "px"],
    ps: ["padding-left", "px"],
    pe: ["padding-right", "px"],
    mt: ["margin-top", "px"],
    mb: ["margin-bottom", "px"],
    ms: ["margin-left", "px"],
    me: ["margin-right", "px"],
    fw: ["font-weight", "00"],
    fs: ["font-size", "px"],
    color: ["color", ""],
    bg: ["background-color", ""],
  };
  
  // 2. Function to validate if the given className has a valid style prefix
  function checkValidClass(className) {
    const parts = className.split("-");
    const prefix = parts[0];
    const value = parts[1];
    return (
      styles[prefix] &&
      !isNaN(value) &&
      parts.length === 2 &&
      Object.hasOwnProperty.call(styles, prefix)
    );
  }

  // 3. Function to apply styles to elements with valid className
  function applyStyle(element, className) {
    if (checkValidClass(className)) {
      const parts = className.split("-");
      const prefix = parts[0];
      const value = parts[1];
      const styleInfo = styles[prefix];

      element.style.setProperty(
        styleInfo[0],
        value + styleInfo[1],
        "important"
      );
    }
  }

  // 4. Construct DOM selectors based on supported style prefixes
  var selector = Object.keys(styles)
    .map(function (prefix) {
      return '[class*="' + prefix + '-"]';
    })
    .join(", ");

  // 5. Select elements in the document using the constructed selectors
  var elements = document.querySelectorAll(selector);

  // 6. Iterate through selected elements and apply dynamic styles
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var classNames = [];

    if (typeof element.className === "string") {
      classNames = element.className.split(" ");
    }
    else if (element.className instanceof SVGAnimatedString) {
      classNames = element.className.baseVal.split(" ");
    }
    for (var j = 0; j < classNames.length; j++) {
      var className = classNames[j];
      if (checkValidClass(className)) {
        applyStyle(element, className);
      }
    }
  }
};

// 7. Invoke the dynamic styling function after window finishes loading (used `requestAnimationFrame`)
window.addEventListener("load", () => {
  requestAnimationFrame(dynamicStyle);
});

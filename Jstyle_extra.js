// --------------------------------------------------------------------------------------------->
var dynamicStyle = function (baseElement = document) {

  // 1. Object mapping style prefixes to corresponding CSS property and its unit
  const stylesNumber = {
    w  : ["width", "%"],
    h  : ["height", "%"],
    p  : ["padding", "px"],
    pt : ["padding-top", "px"],
    pb : ["padding-bottom", "px"],
    ps : ["padding-left", "px"],
    pe : ["padding-right", "px"],
    m  : ["margin", "px"],
    mt : ["margin-top", "px"],
    mb : ["margin-bottom", "px"],
    ms : ["margin-left", "px"],
    me : ["margin-right", "px"],
    fw : ["font-weight", "00"],
    fs : ["font-size", "px"],
  };

  const stylesString = {
    "d-center": {
      "display": "flex",
      "justify-content": "center",
      "align-items": "center",
      "text-align": "center",
    },
    "d-left": {
      "display": "flex",
      "justify-content": "flex-start",
      "align-items": "center",
      "text-align": "left",
    },
    "d-right": {
      "display": "flex",
      "justify-content": "flex-end",
      "align-items": "center",
      "text-align": "right",
    },
    "d-none": {
      "display": "none",
    },
    "d-flex": {
      "display": "flex",
    },
    "over-hidden": {
      "overflow": "hidden",
    },
    "over-auto": {
      "overflow": "auto",
    },
    "pointer": {
      "cursor": "pointer",
    },
    "resize-none": {
      "resize": "none",
    },
  };

  // 1-1. Handle negative margins
  for (let prefix in stylesNumber) {
    if (prefix.startsWith('m')) {
      stylesNumber[prefix + '-n'] = stylesNumber[prefix];
    }
  }

  // 2. Function to validate if the given className has a valid style prefix
  function checkValidClass(className) {
    if (stylesString[className]) {
      return true;
    }

    const parts = className.split("-");
    const prefix = parts[0];
    const value = parts[1];
    return (
      stylesNumber[prefix] &&
      !isNaN(value) &&
      parts.length === 2
    );
  }

  // 3. Function to apply styles to elements with valid className
  function applyStyle(element, className) {
    if (stylesString[className]) {
      for (let prop in stylesString[className]) {
        element.style[prop] = stylesString[className][prop];
      }
      return;
    }

    const parts = className.split("-");
    let prefix = parts[0];
    let value = parts[1];

    // Adjust value for negative margin (m-nX 형태 확인)
    if (value && value.startsWith('n')) {
      value = "-" + value.slice(1); // 'n' 제거하고 음수로 변경
    }

    if (stylesNumber[prefix] && value && !isNaN(parseFloat(value))) {
      const styleInfo = stylesNumber[prefix];
      element.style.setProperty(
        styleInfo[0],
        value + styleInfo[1],
        "important"
      );
    }
  }

  // 4. Construct DOM selectors based on supported style prefixes
  var numberSelector = Object.keys(stylesNumber).flatMap(function (prefix) {
    return `[class*=${prefix}-]`;
  })
  .join(", ");

  var stringSelector = Object.keys(stylesString).flatMap(function (prefix) {
    return `.${prefix}`;
  })
  .join(", ");

  var selector = `${numberSelector}, ${stringSelector}`;

  // 5. Select elements in the document using the constructed selectors
  var elements = document.querySelectorAll(selector);

  // 6. Iterate through selected elements and apply dynamic styles
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var classNames = element.className;

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

  // Observe dynamic changes and apply styles
  const observer = new MutationObserver(mutations => {
    for (let mutation of mutations) {
      if (mutation.type === "childList") {
        for (let addedNode of mutation.addedNodes) {
          if (addedNode.nodeType === Node.ELEMENT_NODE) {
            dynamicStyle(addedNode);
          }
        }
      }
    }
  });

  observer.observe (baseElement, {
    attributes: false,
    childList: true,
    subtree: true,
  });
};

// 7. Add event listener for DOMContentLoaded event
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", dynamicStyle);
}
else {
  dynamicStyle();
}

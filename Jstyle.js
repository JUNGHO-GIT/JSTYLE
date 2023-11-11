// dynamicStyle.js
var dynamicStyle = function (baseElement = document) {

  // Define styleMap for each style type ---------------------------------------------------------->
  var stylesNumber = {
    w  : ["width", "%"],
    h  : ["height", "%"],
    t  : ["top", "px"],
    b  : ["bottom", "px"],
    l  : ["left", "px"],
    r  : ["right", "px"],
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

  var stylesString = {
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
    "d-inline-block": {
      "display": "inline-block",
    },
    "d-inline-flex": {
      "display": "inline-flex",
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
    "webkit-fill": {
      "width": "-webkit-fill-available",
      "height": "-webkit-fill-available",
    },
    "pos-rel": {
      "position": "relative",
    },
    "pos-ab": {
      "position": "absolute",
    },
    "pos-fix": {
      "position": "fixed",
    },
    "pos-stc": {
      "position": "static",
    },
  };

  // Check if class name is valid --------------------------------------------------------------->
  var isValidClass = (className) => {
    var isNumberBased = !!stylesNumber[className.split("-")[0]];
    var isStringBased = !!stylesString[className];
    return isNumberBased || isStringBased;
  };

  // Apply style to element ----------------------------------------------------------------------->
  var applyStyle = (element) => {
    element.classList.forEach((className) => {
      if (isValidClass(className)) {

        // Convert to negative number if needed
        var [prefix, value] = className.split("-");
        if (value && value.startsWith("n")) {
          value = "-" + value.substring(1);
        }

        if (stylesNumber[prefix]) {
          var [property, unit] = stylesNumber[prefix];
          element.style[property] = `${value}${unit}`;
        }
        else if (stylesString[className]) {
          Object.entries(stylesString[className]).forEach(([property, value]) => {
            element.style[property] = value;
          });
        }
      }
    });
  };

  // Define selector ------------------------------------------------------------------------------>
  var numberSelector = Object.keys(stylesNumber).map((prefix) => `[class*="${prefix}-"]`).join(", ");
  var stringSelector = Object.keys(stylesString).join(", ");
  var selector = `${numberSelector}, ${stringSelector}`;

  // Query all elements and apply style ----------------------------------------------------------->
  baseElement.querySelectorAll(selector).forEach(applyStyle);

  var observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            applyStyle(node);
          }
        });
      }
    });
  });

  observer.observe(baseElement, {
    childList: true,
    subtree: true
  });
};

// Apply styles when DOM is ready ----------------------------------------------------------------->
document.addEventListener("DOMContentLoaded", () => {
  dynamicStyle();
});

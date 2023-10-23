var dynamicStyle = function (baseElement = document) {
  const styleMap = new Map();

  // 1. Object mapping style prefixes to corresponding CSS property and its unit
  var stylesNumber = {
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
    }
  };

  // Populate styleMap
  Object.keys(stylesNumber).forEach((key) => {
    styleMap.set(key, { type: "number", prefix: key });
  });

  Object.keys(stylesString).forEach((key) => {
    styleMap.set(key, { type: "string" });
  });

  function applyStyle(element, className, styleInfo) {
    if (styleInfo.type === "string") {
      Object.assign(element.style, stylesString[className]);
    } else if (styleInfo.type === "number") {
      const [property, unit] = stylesNumber[styleInfo.prefix];
      element.style.setProperty(
        property,
        `${styleInfo.value}${unit}`,
        "important"
      );
    }
  }

  function checkAndApplyStyle(element) {
    const classNames = element.className.split(" ");
    for (const className of classNames) {
      let value = className.split("-")[1];
      let prefix = className.split("-")[0];
      // Convert to negative
      if (value && value.startsWith("n")) {
        value = "-" + value.substring(1);
      }

      const styleInfo = styleMap.get(prefix);
      if (styleInfo) {
        if (styleInfo.type === "number" && !isNaN(value)) {
          const [property, unit] = stylesNumber[styleInfo.prefix];
          element.style.setProperty(property, `${value}${unit}`, "important");
        } else if (styleInfo.type === "string") {
          applyStyle(element, className, styleInfo);
        }
      }
    }
  }

  // Initial application
  baseElement
    .querySelectorAll("*")
    .forEach((element) => checkAndApplyStyle(element));

  // Observe dynamic changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            checkAndApplyStyle(node);
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

// Apply styles when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  dynamicStyle();
});

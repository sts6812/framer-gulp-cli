
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Layers":[function(require,module,exports){
module.exports = {
  all: function() {
    return Framer.CurrentContext.layers;
  },
  withName: function(name) {
    return _.filter(this.all(), function(layer) {
      if (layer.name === name) {
        return true;
      }
    });
  },
  containing: function(name) {
    return _.filter(this.all(), function(layer) {
      if (layer.name.indexOf(name) !== -1) {
        return true;
      }
    });
  },
  withWord: function(name, delimiter) {
    var both, end, start;
    if (delimiter == null) {
      delimiter = '_';
    }
    both = delimiter + name + delimiter;
    end = name + delimiter;
    start = delimiter + name;
    return _.filter(this.all(name), function(layer) {
      if (layer.name === name) {
        return true;
      } else if (layer.name.indexOf(both) !== -1) {
        return true;
      } else if (layer.name.indexOf(end) === 0) {
        return true;
      } else if (layer.name.indexOf(start) === layer.name.length - start.length) {
        return true;
      }
    });
  },
  startingWith: function(name) {
    return _.filter(this.all(), function(layer) {
      if (layer.name.substring(0, name.length) === name) {
        return true;
      }
    });
  },
  endingWith: function(name) {
    return _.filter(this.all(), function(layer) {
      if (layer.name.indexOf(name, layer.name.length - name.length) !== -1) {
        return true;
      }
    });
  },
  withState: function(state) {
    return _.filter(this.all(), function(layer) {
      var layerStates;
      layerStates = layer.states._orderedStates;
      if (layerStates.indexOf(state) !== -1) {
        return true;
      }
    });
  },
  withCurrentState: function(state) {
    return _.filter(this.all(), function(layer) {
      var currentState;
      currentState = layer.states.current;
      if (currentState.indexOf(state) !== -1) {
        return true;
      }
    });
  },
  withSuperLayer: function(name) {
    var i, layer, len, matchingLayers, ref, results;
    matchingLayers = [];
    ref = this.withName(name);
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      results.push(matchingLayers = matchingLayers.concat(layer.subLayers));
    }
    return results;
  },
  withSubLayer: function(name) {
    var i, layer, len, matchingLayers, ref, results;
    matchingLayers = [];
    ref = this.withName(name);
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      if (matchingLayers.indexOf(layer.superLayer) === -1) {
        results.push(matchingLayers.push(layer.superLayer));
      } else {
        results.push(void 0);
      }
    }
    return results;
  },
  where: function(obj) {
    return _.where(Framer.CurrentContext.getLayers(), obj);
  },
  get: function(name) {
    return this.withName(name)[0];
  }
};

Layer.prototype.switchPrefix = function(newPrefix, delimiter) {
  var name, newName;
  if (delimiter == null) {
    delimiter = '_';
  }
  name = this.name;
  newName = newPrefix + name.slice(name.indexOf(delimiter));
  return module.exports.get(newName);
};

Layer.prototype.findSubLayer = function(needle, recursive) {
  var i, j, len, len1, ref, ref1, subLayer;
  if (recursive == null) {
    recursive = true;
  }
  ref = this.subLayers;
  for (i = 0, len = ref.length; i < len; i++) {
    subLayer = ref[i];
    if (subLayer.name.toLowerCase().indexOf(needle.toLowerCase()) !== -1) {
      return subLayer;
    }
  }
  if (recursive) {
    ref1 = this.subLayers;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      subLayer = ref1[j];
      if (subLayer.findSubLayer(needle, recursive)) {
        return subLayer.findSubLayer(needle, recursive);
      }
    }
  }
};

Layer.prototype.find = function(needle, recursive) {
  if (recursive == null) {
    recursive = true;
  }
  return this.findSubLayer(needle, recursive = true);
};

Layer.prototype.findSuperLayer = function(needle, recursive) {
  if (recursive == null) {
    recursive = true;
  }
  if (this.superLayer.name.toLowerCase().indexOf(needle.toLowerCase()) !== -1) {
    return this.superLayer;
  }
  if (recursive) {
    if (this.superLayer.findSuperLayer(needle, recursive)) {
      return this.superLayer.findSuperLayer(needle, recursive);
    }
  }
};


},{}],"TextLayer":[function(require,module,exports){
var TextLayer, convertTextLayers, convertToTextLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

TextLayer = (function(superClass) {
  extend(TextLayer, superClass);

  function TextLayer(options) {
    if (options == null) {
      options = {};
    }
    this.doAutoSize = false;
    this.doAutoSizeHeight = false;
    if (options.backgroundColor == null) {
      options.backgroundColor = options.setup ? "hsla(60, 90%, 47%, .4)" : "transparent";
    }
    if (options.color == null) {
      options.color = "red";
    }
    if (options.lineHeight == null) {
      options.lineHeight = 1.25;
    }
    if (options.fontFamily == null) {
      options.fontFamily = "Helvetica";
    }
    if (options.fontSize == null) {
      options.fontSize = 20;
    }
    if (options.text == null) {
      options.text = "Use layer.text to add text";
    }
    TextLayer.__super__.constructor.call(this, options);
    this.style.whiteSpace = "pre-line";
    this.style.outline = "none";
  }

  TextLayer.prototype.setStyle = function(property, value, pxSuffix) {
    if (pxSuffix == null) {
      pxSuffix = false;
    }
    this.style[property] = pxSuffix ? value + "px" : value;
    this.emit("change:" + property, value);
    if (this.doAutoSize) {
      return this.calcSize();
    }
  };

  TextLayer.prototype.calcSize = function() {
    var constraints, size, sizeAffectingStyles;
    sizeAffectingStyles = {
      lineHeight: this.style["line-height"],
      fontSize: this.style["font-size"],
      fontWeight: this.style["font-weight"],
      paddingTop: this.style["padding-top"],
      paddingRight: this.style["padding-right"],
      paddingBottom: this.style["padding-bottom"],
      paddingLeft: this.style["padding-left"],
      textTransform: this.style["text-transform"],
      borderWidth: this.style["border-width"],
      letterSpacing: this.style["letter-spacing"],
      fontFamily: this.style["font-family"],
      fontStyle: this.style["font-style"],
      fontVariant: this.style["font-variant"]
    };
    constraints = {};
    if (this.doAutoSizeHeight) {
      constraints.width = this.width;
    }
    size = Utils.textSize(this.text, sizeAffectingStyles, constraints);
    if (this.style.textAlign === "right") {
      this.width = size.width;
      this.x = this.x - this.width;
    } else {
      this.width = size.width;
    }
    return this.height = size.height;
  };

  TextLayer.define("autoSize", {
    get: function() {
      return this.doAutoSize;
    },
    set: function(value) {
      this.doAutoSize = value;
      if (this.doAutoSize) {
        return this.calcSize();
      }
    }
  });

  TextLayer.define("autoSizeHeight", {
    set: function(value) {
      this.doAutoSize = value;
      this.doAutoSizeHeight = value;
      if (this.doAutoSize) {
        return this.calcSize();
      }
    }
  });

  TextLayer.define("contentEditable", {
    set: function(boolean) {
      this._element.contentEditable = boolean;
      this.ignoreEvents = !boolean;
      return this.on("input", function() {
        if (this.doAutoSize) {
          return this.calcSize();
        }
      });
    }
  });

  TextLayer.define("text", {
    get: function() {
      return this._element.textContent;
    },
    set: function(value) {
      this._element.textContent = value;
      this.emit("change:text", value);
      if (this.doAutoSize) {
        return this.calcSize();
      }
    }
  });

  TextLayer.define("fontFamily", {
    get: function() {
      return this.style.fontFamily;
    },
    set: function(value) {
      return this.setStyle("fontFamily", value);
    }
  });

  TextLayer.define("fontSize", {
    get: function() {
      return this.style.fontSize.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("fontSize", value, true);
    }
  });

  TextLayer.define("lineHeight", {
    get: function() {
      return this.style.lineHeight;
    },
    set: function(value) {
      return this.setStyle("lineHeight", value);
    }
  });

  TextLayer.define("fontWeight", {
    get: function() {
      return this.style.fontWeight;
    },
    set: function(value) {
      return this.setStyle("fontWeight", value);
    }
  });

  TextLayer.define("fontStyle", {
    get: function() {
      return this.style.fontStyle;
    },
    set: function(value) {
      return this.setStyle("fontStyle", value);
    }
  });

  TextLayer.define("fontVariant", {
    get: function() {
      return this.style.fontVariant;
    },
    set: function(value) {
      return this.setStyle("fontVariant", value);
    }
  });

  TextLayer.define("padding", {
    set: function(value) {
      this.setStyle("paddingTop", value, true);
      this.setStyle("paddingRight", value, true);
      this.setStyle("paddingBottom", value, true);
      return this.setStyle("paddingLeft", value, true);
    }
  });

  TextLayer.define("paddingTop", {
    get: function() {
      return this.style.paddingTop.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("paddingTop", value, true);
    }
  });

  TextLayer.define("paddingRight", {
    get: function() {
      return this.style.paddingRight.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("paddingRight", value, true);
    }
  });

  TextLayer.define("paddingBottom", {
    get: function() {
      return this.style.paddingBottom.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("paddingBottom", value, true);
    }
  });

  TextLayer.define("paddingLeft", {
    get: function() {
      return this.style.paddingLeft.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("paddingLeft", value, true);
    }
  });

  TextLayer.define("textAlign", {
    set: function(value) {
      return this.setStyle("textAlign", value);
    }
  });

  TextLayer.define("textTransform", {
    get: function() {
      return this.style.textTransform;
    },
    set: function(value) {
      return this.setStyle("textTransform", value);
    }
  });

  TextLayer.define("letterSpacing", {
    get: function() {
      return this.style.letterSpacing.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("letterSpacing", value, true);
    }
  });

  TextLayer.define("length", {
    get: function() {
      return this.text.length;
    }
  });

  return TextLayer;

})(Layer);

convertToTextLayer = function(layer, debug) {
  var css, key, styleObj, t, val;
  t = new TextLayer({
    name: layer.name,
    frame: layer.frame,
    parent: layer.parent,
    text: layer._info.metadata.string
  });
  styleObj = {};
  css = layer._info.metadata.css;
  css.forEach(function(rule) {
    var arr, prop, value;
    if (_.includes(rule, '/*')) {
      return;
    }
    arr = rule.split(': ');
    prop = _.camelCase(arr[0]);
    value = arr[1].replace(';', '');
    if (["fontSize", "letterSpacing", "lineHeight"].indexOf(prop) > -1) {
      value = parseInt(value);
    }
    return styleObj[prop] = value;
  });
  if (styleObj.hasOwnProperty("lineHeight")) {
    styleObj["lineHeight"] = styleObj.lineHeight / styleObj.fontSize;
  } else {
    styleObj["lineHeight"] = 1.3;
  }
  for (key in styleObj) {
    val = styleObj[key];
    t[key] = val;
  }
  t.y -= (t.fontSize / t.lineHeight) / (4 - t.lineHeight);
  t.x -= t.fontSize * 0.07;
  t.width += t.fontSize * 0.5;
  if (debug) {
    layer.opacity = .5;
  } else {
    layer.destroy();
  }
  return t;
};

Layer.prototype.convertToTextLayer = function(debug) {
  return convertToTextLayer(this, debug);
};

convertTextLayers = function(obj, debug) {
  var layer, prop, results;
  results = [];
  for (prop in obj) {
    layer = obj[prop];
    if (layer._info.kind === "text") {
      results.push(obj[prop] = convertToTextLayer(layer, debug));
    } else {
      results.push(void 0);
    }
  }
  return results;
};

Layer.prototype.frameAsTextLayer = function(properties) {
  var t;
  t = new TextLayer;
  t.frame = this.frame;
  t.superLayer = this.superLayer;
  _.extend(t, properties);
  this.destroy();
  return t;
};

exports.TextLayer = TextLayer;

exports.convertTextLayers = convertTextLayers;


},{}],"findModule":[function(require,module,exports){
var _findAll, _getHierarchy, _match;

_getHierarchy = function(layer) {
  var a, i, len, ref, string;
  string = '';
  ref = layer.ancestors();
  for (i = 0, len = ref.length; i < len; i++) {
    a = ref[i];
    string = a.name + '>' + string;
  }
  return string = string + layer.name;
};

_match = function(hierarchy, string) {
  var regExp, regexString;
  string = string.replace(/\s*>\s*/g, '>');
  string = string.split('*').join('[^>]*');
  string = string.split(' ').join('(?:.*)>');
  string = string.split(',').join('$|');
  regexString = "(^|>)" + string + "$";
  regExp = new RegExp(regexString);
  return hierarchy.match(regExp);
};

_findAll = function(selector, fromLayer) {
  var layers, stringNeedsRegex;
  layers = Framer.CurrentContext._layers;
  if (selector != null) {
    stringNeedsRegex = _.find(['*', ' ', '>', ','], function(c) {
      return _.includes(selector, c);
    });
    if (!(stringNeedsRegex || fromLayer)) {
      return layers = _.filter(layers, function(layer) {
        if (layer.name === selector) {
          return true;
        }
      });
    } else {
      return layers = _.filter(layers, function(layer) {
        var hierarchy;
        hierarchy = _getHierarchy(layer);
        if (fromLayer != null) {
          return _match(hierarchy, fromLayer.name + ' ' + selector);
        } else {
          return _match(hierarchy, selector);
        }
      });
    }
  } else {
    return layers;
  }
};

exports.Find = function(selector, fromLayer) {
  return _findAll(selector, fromLayer)[0];
};

exports.ƒ = function(selector, fromLayer) {
  return _findAll(selector, fromLayer)[0];
};

exports.FindAll = function(selector, fromLayer) {
  return _findAll(selector, fromLayer);
};

exports.ƒƒ = function(selector, fromLayer) {
  return _findAll(selector, fromLayer);
};

Layer.prototype.find = function(selector, fromLayer) {
  return _findAll(selector, this)[0];
};

Layer.prototype.ƒ = function(selector, fromLayer) {
  return _findAll(selector, this)[0];
};

Layer.prototype.findAll = function(selector, fromLayer) {
  return _findAll(selector, this);
};

Layer.prototype.ƒƒ = function(selector, fromLayer) {
  return _findAll(selector, this);
};


},{}],"makeScroll":[function(require,module,exports){
var makeScroll;

makeScroll = function(layer) {
  var scroll;
  scroll = new ScrollComponent({
    mouseWheelEnabled: true,
    width: Framer.Device.screen._properties.width,
    height: Framer.Device.screen._properties.height,
    wrap: layer,
    name: 'custom'
  });
  layer.mouseWheelEnabled = true;
  layer.draggable.enabled = true;
  layer.draggable.momentum = true;
  scroll.name = 'topLevel';
  return scroll;
};

exports.makeScroll = makeScroll;


},{}],"stitch":[function(require,module,exports){
var Parametizer, Scroller, Stitch;

Stitch = (function() {
  Stitch.addComponent = function(component) {
    return _.extend(this.components, component);
  };

  Stitch.components = {
    scroll: function(layer, name, layers, params) {
      var scrollContent, scrollIndicators;
      scrollContent = layers[name + "___scrollContent"];
      scrollIndicators = layers[name + "___scrollIndicators"];
      return new Scroller(layer, _.extend(params, {
        scrollContent: scrollContent,
        scrollIndicators: scrollIndicators
      }));
    }
  };

  function Stitch(layers1) {
    this.layers = layers1;
    this.components = this.constructor.components;
    this.findComponents();
  }

  Stitch.prototype.getParams = function(paramsString) {
    var params;
    return params = (new Parametizer(paramsString)).params;
  };

  Stitch.prototype.findComponents = function() {
    var base, layer, layerName, method, name, params, ref, regEx, result, results;
    regEx = new RegExp("(.+)" + this.defaults.componentTrigger + "([^_]+)(__(.*))*");
    ref = this.layers;
    results = [];
    for (layerName in ref) {
      layer = ref[layerName];
      if (result = layer.name.match(regEx)) {
        name = result[1];
        method = result[2];
        params = this.getParams(result[4]);
        results.push(typeof (base = this.components)[method] === "function" ? base[method](layer, name, this.layers, params) : void 0);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  Stitch.prototype.defaults = {
    componentTrigger: '___'
  };

  return Stitch;

})();

Parametizer = (function() {
  function Parametizer(paramsString1, options) {
    this.paramsString = paramsString1;
    if (options == null) {
      options = {};
    }
    this.options = _.extend({}, this.defaults, options);
    this.params = this.objectize(this.paramsString);
    this.params = this.filterParams(this.params);
  }

  Parametizer.prototype.objectize = function(paramsString) {
    var params;
    if (!this.paramsString) {
      return {};
    }
    return params = _.zipObject(paramsString.split('__').map(function(val) {
      return val.split('_');
    }));
  };

  Parametizer.prototype.filterParams = function(params) {
    _.each(this.options.activeFilters, (function(_this) {
      return function(filter) {
        return params = _.reduce(params, function(memo, val, key) {
          memo[key] = _this.filters[filter](val);
          return memo;
        }, {});
      };
    })(this));
    return params;
  };

  Parametizer.prototype.defaults = {
    argumentSeparator: '__',
    keyValueSeparator: '_',
    activeFilters: ['booleans', 'numbers', 'blank']
  };

  Parametizer.prototype.filters = {
    booleans: function(val) {
      if (val === 'true') {
        return true;
      } else if (val === 'false') {
        return false;
      } else {
        return val;
      }
    },
    numbers: function(val) {
      if ((!isNaN(val)) && (val !== false)) {
        return +val;
      } else {
        return val;
      }
    },
    blank: function(val) {
      if (val === void 0) {
        return true;
      } else {
        return val;
      }
    }
  };

  return Parametizer;

})();

Scroller = (function() {
  function Scroller(scrollContainer, options) {
    this.scrollContainer = scrollContainer;
    if (options == null) {
      options = {};
    }
    this.options = _.extend({}, this.defaults, options);
    if (this.options.scrollContent) {
      this.repositionContent();
    }
    this.setScrollerDimensions();
    this.createScroller();
    this.setupScrollDirection();
  }

  Scroller.prototype.defaults = {
    paginated: false,
    scrollContent: null,
    mouseWheelEnabled: true,
    scrollIndicators: true,
    originX: 0.5,
    originY: 0.5,
    inset: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  };

  Scroller.prototype.createScroller = function() {
    if (this.options.paginated) {
      this.scroller = PageComponent.wrap(this.scrollContainer);
      this.scroller.originX = this.options.originX;
      this.scroller.originY = this.options.originY;
      if (this.options.scrollIndicators) {
        this.setupIndicators();
      }
    } else {
      this.scroller = ScrollComponent.wrap(this.scrollContainer);
    }
    this.scroller.content.draggable.directionLock = true;
    this.scroller.contentInset = this.options.inset;
    return this.scrollContainer.scrollComponent = this.scroller;
  };

  Scroller.prototype.setupIndicators = function() {
    var i, indicator, indicatorWrap, j, k, layer, len, len1, offLayer, onLayer, ref, ref1;
    onLayer = this.options.scrollIndicators.subLayersByName('on')[0].copy();
    offLayer = this.options.scrollIndicators.subLayersByName('off')[0].copy();
    ref = this.options.scrollIndicators.subLayers;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      indicator = ref[i];
      indicatorWrap = indicator.copy();
      indicatorWrap.props = {
        name: 'indicator',
        superLayer: indicator.superLayer,
        image: null
      };
      indicator.destroy();
      indicatorWrap.onLayer = onLayer.copy();
      indicatorWrap.offLayer = offLayer.copy();
      ref1 = [indicatorWrap.onLayer, indicatorWrap.offLayer];
      for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
        layer = ref1[i];
        layer.props = {
          opacity: 0,
          x: 0,
          superLayer: indicatorWrap
        };
        layer.states.add({
          on: {
            opacity: 1
          }
        });
      }
    }
    this.updateIndicators();
    return this.scroller.on("change:currentPage", (function(_this) {
      return function() {
        return _this.updateIndicators();
      };
    })(this));
  };

  Scroller.prototype.updateIndicators = function() {
    var i, indicator, j, len, ref, results;
    ref = _.sortBy(this.options.scrollIndicators.subLayers, function(l) {
      return l.x;
    });
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      indicator = ref[i];
      if (i === this.scroller.horizontalPageIndex(this.scroller.currentPage)) {
        indicator.onLayer.states["switch"]('on');
        results.push(indicator.offLayer.states["switch"]('default'));
      } else {
        indicator.onLayer.states["switch"]('default');
        results.push(indicator.offLayer.states["switch"]('on'));
      }
    }
    return results;
  };

  Scroller.prototype.findOffset = function(layer, axis) {
    if (layer.superLayer) {
      return layer[axis] + this.findOffset(layer.superLayer, axis);
    } else {
      return layer[axis];
    }
  };

  Scroller.prototype.setScrollerDimensions = function() {
    this.scrollContainer.width = (function() {
      switch (this.options.width) {
        case 'full':
          return Screen.width;
        case void 0:
          return Math.min(this.scrollContainer.width, Screen.width);
        default:
          return this.options.width;
      }
    }).call(this);
    return this.scrollContainer.height = (function() {
      switch (this.options.height) {
        case 'full':
          return Screen.height;
        case void 0:
          return this.scrollContainer.height;
        default:
          return this.options.height;
      }
    }).call(this);
  };

  Scroller.prototype.setupScrollDirection = function() {
    if (!this.options.hasOwnProperty('scrollHorizontal')) {
      this.options.scrollHorizontal = this.scroller.content.width > this.scroller.width;
    }
    if (!this.options.hasOwnProperty('scrollVertical')) {
      this.options.scrollVertical = this.scroller.content.height > this.scroller.height;
    }
    this.scroller.scrollHorizontal = this.options.scrollHorizontal;
    return this.scroller.scrollVertical = this.options.scrollVertical;
  };

  Scroller.prototype.repositionContent = function() {
    var i, layer, placeholder, placeholderIndex, ref;
    placeholder = this.scrollContainer.subLayersByName('placeholder')[0];
    placeholderIndex = placeholder.index;
    this.options.inset = {
      top: placeholder.y,
      right: placeholder.x,
      bottom: placeholder.y,
      left: placeholder.x
    };
    this.options.scrollContent.props = {
      x: 0,
      y: 0
    };
    if (this.options.scrollContent.subLayers.length > 0) {
      ref = this.options.scrollContent.subLayers;
      for (i in ref) {
        layer = ref[i];
        layer.superLayer = this.scrollContainer;
      }
    } else {
      this.options.scrollContent.superLayer = placeholder.superLayer;
    }
    return placeholder.destroy();
  };

  return Scroller;

})();

exports.Stitch = Stitch;


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uL21vZHVsZXMvc3RpdGNoLmNvZmZlZSIsIi4uL21vZHVsZXMvbWFrZVNjcm9sbC5jb2ZmZWUiLCIuLi9tb2R1bGVzL2ZpbmRNb2R1bGUuY29mZmVlIiwiLi4vbW9kdWxlcy9UZXh0TGF5ZXIuY29mZmVlIiwiLi4vbW9kdWxlcy9MYXllcnMuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIjIFRoZSBTdGl0Y2ggY2xhc3MgYXV0b21hZ2ljYWxseSBhcHBsaWVzIGZ1bmN0aW9uYWxpdHkgdG8gRnJhbWVyIGxheWVyc1xuIyBiYXNlZCBvbiB0aGUgbGF5ZXIncyBuYW1lLlxuIyBcbiMgSW1wb3J0IHRoZSBTdGl0Y2ggY2xhc3MgaW50byBmcmFtZXI6XG4jICAgU3RpdGNoID0gcmVxdWlyZSgnc3RpdGNoJykuU3RpdGNoXG4jIFxuIyBUaGVuIGluc3RhbnRpYXRlIFN0aXRjaCB3aXRoIHlvdXIgbGF5ZXJzOlxuIyAgIG5ldyBTdGl0Y2ggbGF5ZXJzSW1wb3J0ZWRGcm9tU2tldGNoT3JQaG90b3Nob3BcbiMgXG4jIEV4YW1wbGVzXG4jICAgQSBsYXllciB0cmVlIHcvIHRoZSBmb2xsb3dpbmcgbGF5ZXJzIHdvdWxkIGNyZWF0ZSBhIHBhZ2UgY29tcG9uZW50IHdpdGggMyBwYWdlczpcbiMgICAgIC0gbWFpbl9fX3Njcm9sbF9fcGFnaW5hdGVkXG4jICAgICAgIC0gcGFnZV9hXG4jICAgICAgIC0gcGFnZV9iXG4jICAgICAgIC0gcGFnZV9jXG4jIFxuY2xhc3MgU3RpdGNoXG4gIEBhZGRDb21wb25lbnQ6IChjb21wb25lbnQpIC0+XG4gICAgXy5leHRlbmQgQGNvbXBvbmVudHMsIGNvbXBvbmVudFxuICAgIFxuICAjIEFuIG9iamVjdCB1c2VkIHRvIHN0b3JlIHRoZSBjb21wb25lbnRzLiBBbnkgbGF5ZXIgd2l0aCBcIl9fXyN7a2V5fVwiIGluIHRoZVxuICAjIGxheWVyIG5hbWUgd2lsbCBhY3RpdmF0ZSB0aGUgY29tcG9uZW50LlxuICBAY29tcG9uZW50czogXG4gICAgc2Nyb2xsOiAobGF5ZXIsIG5hbWUsIGxheWVycywgcGFyYW1zKSAtPlxuICAgICAgc2Nyb2xsQ29udGVudCA9IGxheWVyc1tcIiN7bmFtZX1fX19zY3JvbGxDb250ZW50XCJdXG4gICAgICBzY3JvbGxJbmRpY2F0b3JzID0gbGF5ZXJzW1wiI3tuYW1lfV9fX3Njcm9sbEluZGljYXRvcnNcIl1cbiAgICAgIG5ldyBTY3JvbGxlciBsYXllciwgXy5leHRlbmQocGFyYW1zLCB7IHNjcm9sbENvbnRlbnQ6IHNjcm9sbENvbnRlbnQsIHNjcm9sbEluZGljYXRvcnM6IHNjcm9sbEluZGljYXRvcnMgfSlcblxuICBjb25zdHJ1Y3RvcjogKEBsYXllcnMpIC0+XG4gICAgQGNvbXBvbmVudHMgPSBAY29uc3RydWN0b3IuY29tcG9uZW50c1xuICAgIEBmaW5kQ29tcG9uZW50cygpXG4gIFxuICAjIFRha2VzIHRoZSBwYXJhbWV0ZXIgc3RyaW5nIGFuZCBzZXBhcmF0ZXMgaXQgaW50b1xuICBnZXRQYXJhbXM6IChwYXJhbXNTdHJpbmcpIC0+XG4gICAgcGFyYW1zID0gKG5ldyBQYXJhbWV0aXplcihwYXJhbXNTdHJpbmcpKS5wYXJhbXNcbiAgXG4gICMgTG9va3MgdGhyb3VnaCB0aGUgbGF5ZXJzIGZvciBsYXllciBuYW1lcyB0aGF0IG1hdGNoIHdpdGggdGhlIGtleXMgZnJvbVxuICAjIHRoZSBjb21wb25lbnRzIG9iamVjdC5cbiAgZmluZENvbXBvbmVudHM6IC0+XG4gICAgcmVnRXggPSBuZXcgUmVnRXhwIFwiKC4rKSN7QGRlZmF1bHRzLmNvbXBvbmVudFRyaWdnZXJ9KFteX10rKShfXyguKikpKlwiXG5cbiAgICBmb3IgbGF5ZXJOYW1lLCBsYXllciBvZiBAbGF5ZXJzXG4gICAgICBpZiByZXN1bHQgPSBsYXllci5uYW1lLm1hdGNoIHJlZ0V4XG4gICAgICAgIG5hbWUgPSByZXN1bHRbMV1cbiAgICAgICAgbWV0aG9kID0gcmVzdWx0WzJdXG4gICAgICAgIHBhcmFtcyA9IEBnZXRQYXJhbXMgcmVzdWx0WzRdXG4gICAgICAgIEBjb21wb25lbnRzW21ldGhvZF0/KGxheWVyLCBuYW1lLCBAbGF5ZXJzLCBwYXJhbXMpXG5cbiAgZGVmYXVsdHM6XG4gICAgY29tcG9uZW50VHJpZ2dlcjogJ19fXydcblxuXG5cbiMgQSBjbGFzcyBmb3IgdHVybmluZyBhIHN0cmluZyBpbnRvIGtleS92YWx1ZSBwYWlycy5cbiMgXG4jIHBhcmFtc1N0cmluZyAtIEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIHBhcmFtZXRlcnMgc2VwYXJhdGVkIGJ5IHRoZSBwcm9wZXIgYXJndW1lbnRTZXBhcmF0b3JzIGFuZCBrZXlWYWx1ZVNlcGFyYXRvcnNcbiMgb3B0aW9ucyAtIEFuIG9wdGlvbmFsIG9iamVjdCB0byBvdmVycmlkZSB0aGUgZGVmYXVsdHNcbiMgICAgICAgICAgIDphcmd1bWVudFNlcGFyYXRvciAtIFRoZSBzdHJpbmcgdXNlZCB0byBzZXBhcmF0ZSB0aGUga2V5L3ZhbHVlIHBhaXIgYXJndW1lbnRzXG4jICAgICAgICAgICA6a2V5VmFsdWVTZXBhcmF0b3IgLSBUaGUgc3RyaW5nIHVzZWQgdG8gc2VwYXJhdGUga2V5cyBmcm9tIHZhbHVlc1xuIyAgICAgICAgICAgOmFjdGl2ZUZpbHRlcnMgLSBBIGxpc3Qgb2YgZmlsdGVycyB0byBiZSBhcHBsaWVkIHRvIHRoZSBrZXkvdmFsdWUgcGFpcnNcbiMgXG4jIEV4YW1wbGVzXG4jICAobmV3IFBhcmFtZXRpemVyKFwid2lkdGhfNTBfX2hlaWdodF8xMDBfX3BhZ2luYXRlZFwiKSkucGFyYW1zIHdvdWxkIHJldHVybjpcbiMgIHtcbiMgICAgd2lkdGg6IDUwLFxuIyAgICBoZWlnaHQ6IDEwMCxcbiMgICAgcGFnaW5hdGVkOiB0cnVlXG4jICB9XG5jbGFzcyBQYXJhbWV0aXplclxuICBjb25zdHJ1Y3RvcjogKEBwYXJhbXNTdHJpbmcsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICBAb3B0aW9ucyA9IF8uZXh0ZW5kIHt9LCBAZGVmYXVsdHMsIG9wdGlvbnNcblxuICAgIEBwYXJhbXMgPSBAb2JqZWN0aXplIEBwYXJhbXNTdHJpbmdcbiAgICBAcGFyYW1zID0gQGZpbHRlclBhcmFtcyBAcGFyYW1zXG4gICAgXG4gIG9iamVjdGl6ZTogKHBhcmFtc1N0cmluZykgLT5cbiAgICByZXR1cm4ge30gdW5sZXNzIEBwYXJhbXNTdHJpbmdcbiAgICBcbiAgICAjIENyZWF0ZSBhIHBhcmFtcyBvYmplY3Qgb3V0IG9mIGtleS92YWx1ZSBwYWlycyBmb3VuZCBpbiB0aGUgbGF5ZXIgbmFtZVxuICAgIHBhcmFtcyA9IF8uemlwT2JqZWN0IHBhcmFtc1N0cmluZy5zcGxpdCgnX18nKS5tYXAgKHZhbCkgLT4gdmFsLnNwbGl0KCdfJylcbiAgICBcbiAgZmlsdGVyUGFyYW1zOiAocGFyYW1zKSAtPlxuICAgIF8uZWFjaCBAb3B0aW9ucy5hY3RpdmVGaWx0ZXJzLCAoZmlsdGVyKSA9PlxuICAgICAgcGFyYW1zID0gXy5yZWR1Y2UgcGFyYW1zLCAobWVtbywgdmFsLCBrZXkpID0+XG4gICAgICAgIG1lbW9ba2V5XSA9IEBmaWx0ZXJzW2ZpbHRlcl0odmFsKVxuICAgICAgICByZXR1cm4gbWVtb1xuICAgICAgLCB7fVxuICAgICAgXG4gICAgcmV0dXJuIHBhcmFtc1xuICAgIFxuICBkZWZhdWx0czpcbiAgICBhcmd1bWVudFNlcGFyYXRvcjogJ19fJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgd2hhdCBjaGFyYWN0ZXIgc2lnbmlmaWVzIGEgbmV3IGtleS92YWx1ZSBhcmd1bWVudCBwYWlyXG4gICAga2V5VmFsdWVTZXBhcmF0b3I6ICdfJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHdoYXQgY2hhcmFjdGVyIHNlcGFyYXRlcyB0aGUgdmFsdWUgZnJvbSB0aGUga2V5XG4gICAgYWN0aXZlRmlsdGVyczogWydib29sZWFucycsICdudW1iZXJzJywgJ2JsYW5rJ11cbiAgXG4gIGZpbHRlcnM6XG4gICAgYm9vbGVhbnM6ICh2YWwpIC0+XG4gICAgICBpZiB2YWwgaXMgJ3RydWUnXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICBlbHNlIGlmIHZhbCBpcyAnZmFsc2UnXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gdmFsXG4gICAgbnVtYmVyczogKHZhbCkgLT5cbiAgICAgIGlmIChub3QgaXNOYU4gdmFsKSBhbmQgKHZhbCAhPSBmYWxzZSlcbiAgICAgICAgcmV0dXJuICt2YWxcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIHZhbFxuICAgIGJsYW5rOiAodmFsKSAtPlxuICAgICAgaWYgdmFsIGlzIHVuZGVmaW5lZFxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gdmFsXG5cblxuIyBBIGNsYXNzIGZvciBtYWtpbmcgYSBsYXllciBzY3JvbGxhYmxlLlxuY2xhc3MgU2Nyb2xsZXJcbiAgY29uc3RydWN0b3I6IChAc2Nyb2xsQ29udGFpbmVyLCBvcHRpb25zID0ge30pIC0+XG4gICAgQG9wdGlvbnMgPSBfLmV4dGVuZCB7fSwgQGRlZmF1bHRzLCBvcHRpb25zICAgIFxuICAgIFxuICAgIGlmIEBvcHRpb25zLnNjcm9sbENvbnRlbnRcbiAgICAgIEByZXBvc2l0aW9uQ29udGVudCgpXG5cbiAgICBAc2V0U2Nyb2xsZXJEaW1lbnNpb25zKClcbiAgICBAY3JlYXRlU2Nyb2xsZXIoKVxuICAgIEBzZXR1cFNjcm9sbERpcmVjdGlvbigpXG4gIFxuICBkZWZhdWx0czpcbiAgICBwYWdpbmF0ZWQ6IGZhbHNlXG4gICAgc2Nyb2xsQ29udGVudDogbnVsbFxuICAgIG1vdXNlV2hlZWxFbmFibGVkOiB0cnVlXG4gICAgc2Nyb2xsSW5kaWNhdG9yczogdHJ1ZVxuICAgIG9yaWdpblg6IDAuNVxuICAgIG9yaWdpblk6IDAuNVxuICAgIGluc2V0OlxuICAgICAgdG9wOiAwXG4gICAgICByaWdodDogMFxuICAgICAgYm90dG9tOiAwXG4gICAgICBsZWZ0OiAwXG4gIFxuICAjIENyZWF0ZXMgdGhlIHNjcm9sbENvbXBvbmVudCBvciBwYWdlQ29tcG9uZW50LCBhbmQgbWFrZXMgaXQgYWNjZXNzaWJsZVxuICAjIG9uIHRoZSBsYXllciBpdHNlbGYgYXMgbGF5ZXIuc2Nyb2xsQ29tcG9uZW50XG4gIGNyZWF0ZVNjcm9sbGVyOiAtPlxuICAgIGlmIEBvcHRpb25zLnBhZ2luYXRlZFxuICAgICAgQHNjcm9sbGVyID0gUGFnZUNvbXBvbmVudC53cmFwIEBzY3JvbGxDb250YWluZXJcbiAgICAgIEBzY3JvbGxlci5vcmlnaW5YID0gQG9wdGlvbnMub3JpZ2luWFxuICAgICAgQHNjcm9sbGVyLm9yaWdpblkgPSBAb3B0aW9ucy5vcmlnaW5ZXG4gICAgICBAc2V0dXBJbmRpY2F0b3JzKCkgaWYgQG9wdGlvbnMuc2Nyb2xsSW5kaWNhdG9yc1xuICAgIGVsc2VcbiAgICAgIEBzY3JvbGxlciA9IFNjcm9sbENvbXBvbmVudC53cmFwIEBzY3JvbGxDb250YWluZXJcblxuICAgIEBzY3JvbGxlci5jb250ZW50LmRyYWdnYWJsZS5kaXJlY3Rpb25Mb2NrID0gdHJ1ZVxuICAgIEBzY3JvbGxlci5jb250ZW50SW5zZXQgPSBAb3B0aW9ucy5pbnNldFxuXG4gICAgQHNjcm9sbENvbnRhaW5lci5zY3JvbGxDb21wb25lbnQgPSBAc2Nyb2xsZXJcblxuICAjIFNldHVwIHRoZSBwcm9wZXIgbGF5ZXJzIGFuZCBsYXllciBzdGF0ZXMgZm9yIHR1cm5pbmcgb24gYW5kIG9mZiBwYWdpbmF0aW9uIGluZGljYXRvcnNcbiAgc2V0dXBJbmRpY2F0b3JzOiAtPlxuICAgIG9uTGF5ZXIgPSBAb3B0aW9ucy5zY3JvbGxJbmRpY2F0b3JzLnN1YkxheWVyc0J5TmFtZSgnb24nKVswXS5jb3B5KClcbiAgICBvZmZMYXllciA9IEBvcHRpb25zLnNjcm9sbEluZGljYXRvcnMuc3ViTGF5ZXJzQnlOYW1lKCdvZmYnKVswXS5jb3B5KClcblxuICAgICMgQ3JlYXRlIGxheWVycyB0aGF0IGNvbnRhaW4gYm90aCB0aGUgb24gYW5kIG9mZiBpbmRpY2F0b3JzXG4gICAgZm9yIGluZGljYXRvciwgaSBpbiBAb3B0aW9ucy5zY3JvbGxJbmRpY2F0b3JzLnN1YkxheWVyc1xuICAgICAgaW5kaWNhdG9yV3JhcCA9IGluZGljYXRvci5jb3B5KClcbiAgICAgIGluZGljYXRvcldyYXAucHJvcHMgPSBuYW1lOiAnaW5kaWNhdG9yJywgc3VwZXJMYXllcjogaW5kaWNhdG9yLnN1cGVyTGF5ZXIsIGltYWdlOiBudWxsXG4gICAgICBpbmRpY2F0b3IuZGVzdHJveSgpXG5cbiAgICAgIGluZGljYXRvcldyYXAub25MYXllciA9IG9uTGF5ZXIuY29weSgpXG4gICAgICBpbmRpY2F0b3JXcmFwLm9mZkxheWVyID0gb2ZmTGF5ZXIuY29weSgpXG5cbiAgICAgIGZvciBsYXllciwgaSBpbiBbaW5kaWNhdG9yV3JhcC5vbkxheWVyLCBpbmRpY2F0b3JXcmFwLm9mZkxheWVyXVxuICAgICAgICBsYXllci5wcm9wcyA9IG9wYWNpdHk6IDAsIHg6IDAsIHN1cGVyTGF5ZXI6IGluZGljYXRvcldyYXBcbiAgICAgICAgbGF5ZXIuc3RhdGVzLmFkZCBvbjogb3BhY2l0eTogMVxuXG4gICAgQHVwZGF0ZUluZGljYXRvcnMoKVxuICAgIEBzY3JvbGxlci5vbiBcImNoYW5nZTpjdXJyZW50UGFnZVwiLCA9PlxuICAgICAgQHVwZGF0ZUluZGljYXRvcnMoKVxuXG4gIHVwZGF0ZUluZGljYXRvcnM6IC0+XG4gICAgZm9yIGluZGljYXRvciwgaSBpbiBfLnNvcnRCeShAb3B0aW9ucy5zY3JvbGxJbmRpY2F0b3JzLnN1YkxheWVycywgKGwpIC0+IGwueClcbiAgICAgIGlmIGkgaXMgQHNjcm9sbGVyLmhvcml6b250YWxQYWdlSW5kZXggQHNjcm9sbGVyLmN1cnJlbnRQYWdlXG4gICAgICAgIGluZGljYXRvci5vbkxheWVyLnN0YXRlcy5zd2l0Y2ggJ29uJ1xuICAgICAgICBpbmRpY2F0b3Iub2ZmTGF5ZXIuc3RhdGVzLnN3aXRjaCAnZGVmYXVsdCdcbiAgICAgIGVsc2VcbiAgICAgICAgaW5kaWNhdG9yLm9uTGF5ZXIuc3RhdGVzLnN3aXRjaCAnZGVmYXVsdCdcbiAgICAgICAgaW5kaWNhdG9yLm9mZkxheWVyLnN0YXRlcy5zd2l0Y2ggJ29uJ1xuXG4gICMgQ2FsY3VsYXRlcyB0aGUgb2Zmc2V0IG9mIGxheWVyIHJlbGF0aXZlIHRvIHRoZSBzY3JlZW5cbiAgZmluZE9mZnNldDogKGxheWVyLCBheGlzKSAtPlxuICAgIGlmIGxheWVyLnN1cGVyTGF5ZXJcbiAgICAgIHJldHVybiBsYXllcltheGlzXSArIEBmaW5kT2Zmc2V0KGxheWVyLnN1cGVyTGF5ZXIsIGF4aXMpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGxheWVyW2F4aXNdXG5cblxuICBzZXRTY3JvbGxlckRpbWVuc2lvbnM6IC0+XG4gICAgQHNjcm9sbENvbnRhaW5lci53aWR0aCA9IHN3aXRjaCBAb3B0aW9ucy53aWR0aFxuICAgICAgd2hlbiAnZnVsbCcgdGhlbiBTY3JlZW4ud2lkdGhcbiAgICAgIHdoZW4gdW5kZWZpbmVkIHRoZW4gTWF0aC5taW4gQHNjcm9sbENvbnRhaW5lci53aWR0aCwgU2NyZWVuLndpZHRoXG4gICAgICBlbHNlIEBvcHRpb25zLndpZHRoXG4gICAgQHNjcm9sbENvbnRhaW5lci5oZWlnaHQgPSBzd2l0Y2ggQG9wdGlvbnMuaGVpZ2h0XG4gICAgICB3aGVuICdmdWxsJyB0aGVuIFNjcmVlbi5oZWlnaHRcbiAgICAgIHdoZW4gdW5kZWZpbmVkIHRoZW4gQHNjcm9sbENvbnRhaW5lci5oZWlnaHRcbiAgICAgIGVsc2UgQG9wdGlvbnMuaGVpZ2h0XG4gICAgICBcbiAgc2V0dXBTY3JvbGxEaXJlY3Rpb246IC0+XG4gICAgdW5sZXNzIEBvcHRpb25zLmhhc093blByb3BlcnR5ICdzY3JvbGxIb3Jpem9udGFsJ1xuICAgICAgQG9wdGlvbnMuc2Nyb2xsSG9yaXpvbnRhbCA9IEBzY3JvbGxlci5jb250ZW50LndpZHRoID4gQHNjcm9sbGVyLndpZHRoXG4gICAgdW5sZXNzIEBvcHRpb25zLmhhc093blByb3BlcnR5ICdzY3JvbGxWZXJ0aWNhbCdcbiAgICAgIEBvcHRpb25zLnNjcm9sbFZlcnRpY2FsID0gQHNjcm9sbGVyLmNvbnRlbnQuaGVpZ2h0ID4gQHNjcm9sbGVyLmhlaWdodFxuXG4gICAgQHNjcm9sbGVyLnNjcm9sbEhvcml6b250YWwgPSBAb3B0aW9ucy5zY3JvbGxIb3Jpem9udGFsXG4gICAgQHNjcm9sbGVyLnNjcm9sbFZlcnRpY2FsID0gQG9wdGlvbnMuc2Nyb2xsVmVydGljYWxcblxuICByZXBvc2l0aW9uQ29udGVudDogLT5cbiAgICBwbGFjZWhvbGRlciA9IEBzY3JvbGxDb250YWluZXIuc3ViTGF5ZXJzQnlOYW1lKCdwbGFjZWhvbGRlcicpWzBdXG4gICAgcGxhY2Vob2xkZXJJbmRleCA9IHBsYWNlaG9sZGVyLmluZGV4XG5cbiAgICBAb3B0aW9ucy5pbnNldCA9XG4gICAgICB0b3A6IHBsYWNlaG9sZGVyLnlcbiAgICAgIHJpZ2h0OiBwbGFjZWhvbGRlci54XG4gICAgICBib3R0b206IHBsYWNlaG9sZGVyLnlcbiAgICAgIGxlZnQ6IHBsYWNlaG9sZGVyLnhcblxuICAgIEBvcHRpb25zLnNjcm9sbENvbnRlbnQucHJvcHMgPSB4OiAwLCB5OiAwXG5cbiAgICBpZiBAb3B0aW9ucy5zY3JvbGxDb250ZW50LnN1YkxheWVycy5sZW5ndGggPiAwXG4gICAgICBmb3IgaSwgbGF5ZXIgb2YgQG9wdGlvbnMuc2Nyb2xsQ29udGVudC5zdWJMYXllcnNcbiAgICAgICAgbGF5ZXIuc3VwZXJMYXllciA9IEBzY3JvbGxDb250YWluZXJcbiAgICBlbHNlXG4gICAgICBAb3B0aW9ucy5zY3JvbGxDb250ZW50LnN1cGVyTGF5ZXIgPSBwbGFjZWhvbGRlci5zdXBlckxheWVyXG5cbiAgICAjIEBvcHRpb25zLnNjcm9sbENvbnRlbnQuaW5kZXggPSBwbGFjZWhvbGRlckluZGV4XG4gICAgcGxhY2Vob2xkZXIuZGVzdHJveSgpXG5cblxuZXhwb3J0cy5TdGl0Y2ggPSBTdGl0Y2hcbiIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5cblxubWFrZVNjcm9sbCA9IChsYXllciktPlxuICAgIHNjcm9sbCA9IG5ldyBTY3JvbGxDb21wb25lbnRcbiAgICAgICAgbW91c2VXaGVlbEVuYWJsZWQ6IHRydWVcbiAgICAgICAgd2lkdGg6IEZyYW1lci5EZXZpY2Uuc2NyZWVuLl9wcm9wZXJ0aWVzLndpZHRoXG4gICAgICAgIGhlaWdodDogRnJhbWVyLkRldmljZS5zY3JlZW4uX3Byb3BlcnRpZXMuaGVpZ2h0XG4gICAgICAgIHdyYXA6IGxheWVyXG4gICAgICAgIG5hbWU6ICdjdXN0b20nXG4gICAgbGF5ZXIubW91c2VXaGVlbEVuYWJsZWQgPSB0cnVlXG4gICAgbGF5ZXIuZHJhZ2dhYmxlLmVuYWJsZWQgPSB0cnVlICBcbiAgICBsYXllci5kcmFnZ2FibGUubW9tZW50dW0gPSB0cnVlXG5cbiAgICBzY3JvbGwubmFtZT0ndG9wTGV2ZWwnXG4gIFxuICAgIHJldHVybiBzY3JvbGxcblxuXG5cblxuZXhwb3J0cy5tYWtlU2Nyb2xsID0gbWFrZVNjcm9sbCIsIl9nZXRIaWVyYXJjaHkgPSAobGF5ZXIpIC0+XG4gIHN0cmluZyA9ICcnXG4gIGZvciBhIGluIGxheWVyLmFuY2VzdG9ycygpXG4gICAgc3RyaW5nID0gYS5uYW1lKyc+JytzdHJpbmdcbiAgcmV0dXJuIHN0cmluZyA9IHN0cmluZytsYXllci5uYW1lXG5cbl9tYXRjaCA9IChoaWVyYXJjaHksIHN0cmluZykgLT5cbiAgIyBwcmVwYXJlIHJlZ2V4IHRva2Vuc1xuICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSgvXFxzKj5cXHMqL2csJz4nKSAjIGNsZWFuIHVwIHNwYWNlcyBhcm91bmQgYXJyb3dzXG4gIHN0cmluZyA9IHN0cmluZy5zcGxpdCgnKicpLmpvaW4oJ1tePl0qJykgIyBhc3RlcmlrcyBhcyBsYXllciBuYW1lIHdpbGRjYXJkXG4gIHN0cmluZyA9IHN0cmluZy5zcGxpdCgnICcpLmpvaW4oJyg/Oi4qKT4nKSAjIHNwYWNlIGFzIHN0cnVjdHVyZSB3aWxkY2FyZFxuICBzdHJpbmcgPSBzdHJpbmcuc3BsaXQoJywnKS5qb2luKCckfCcpICMgYWxsb3cgbXVsdGlwbGUgc2VhcmNoZXMgdXNpbmcgY29tbWFcbiAgcmVnZXhTdHJpbmcgPSBcIihefD4pXCIrc3RyaW5nK1wiJFwiICMgYWx3YXlzIGJvdHRvbSBsYXllciwgbWF5YmUgcGFydCBvZiBoaWVyYXJjaHlcblxuICByZWdFeHAgPSBuZXcgUmVnRXhwKHJlZ2V4U3RyaW5nKSBcbiAgcmV0dXJuIGhpZXJhcmNoeS5tYXRjaChyZWdFeHApXG5cbl9maW5kQWxsID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+XG4gIGxheWVycyA9IEZyYW1lci5DdXJyZW50Q29udGV4dC5fbGF5ZXJzXG5cbiAgaWYgc2VsZWN0b3I/XG4gICAgc3RyaW5nTmVlZHNSZWdleCA9IF8uZmluZCBbJyonLCcgJywnPicsJywnXSwgKGMpIC0+IF8uaW5jbHVkZXMgc2VsZWN0b3IsY1xuICAgIHVubGVzcyBzdHJpbmdOZWVkc1JlZ2V4IG9yIGZyb21MYXllclxuICAgICAgbGF5ZXJzID0gXy5maWx0ZXIgbGF5ZXJzLCAobGF5ZXIpIC0+IFxuICAgICAgICBpZiBsYXllci5uYW1lIGlzIHNlbGVjdG9yIHRoZW4gdHJ1ZVxuICAgIGVsc2VcbiAgICAgIGxheWVycyA9IF8uZmlsdGVyIGxheWVycywgKGxheWVyKSAtPlxuICAgICAgICAgIGhpZXJhcmNoeSA9IF9nZXRIaWVyYXJjaHkobGF5ZXIpXG4gICAgICAgICAgaWYgZnJvbUxheWVyP1xuICAgICAgICAgICAgX21hdGNoKGhpZXJhcmNoeSwgZnJvbUxheWVyLm5hbWUrJyAnK3NlbGVjdG9yKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIF9tYXRjaChoaWVyYXJjaHksIHNlbGVjdG9yKVxuICBlbHNlXG4gICAgbGF5ZXJzXG5cblxuIyBHbG9iYWxcbmV4cG9ydHMuRmluZCAgICA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPiBfZmluZEFsbChzZWxlY3RvciwgZnJvbUxheWVyKVswXVxuZXhwb3J0cy7GkiAgICAgICA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPiBfZmluZEFsbChzZWxlY3RvciwgZnJvbUxheWVyKVswXVxuXG5leHBvcnRzLkZpbmRBbGwgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT4gX2ZpbmRBbGwoc2VsZWN0b3IsIGZyb21MYXllcilcbmV4cG9ydHMuxpLGkiAgICAgID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+IF9maW5kQWxsKHNlbGVjdG9yLCBmcm9tTGF5ZXIpXG5cbiMgTWV0aG9kc1xuTGF5ZXI6OmZpbmQgICAgID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+IF9maW5kQWxsKHNlbGVjdG9yLCBAKVswXVxuTGF5ZXI6OsaSICAgICAgICA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPiBfZmluZEFsbChzZWxlY3RvciwgQClbMF1cblxuTGF5ZXI6OmZpbmRBbGwgID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+IF9maW5kQWxsKHNlbGVjdG9yLCBAKVxuTGF5ZXI6OsaSxpIgICAgICAgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT4gX2ZpbmRBbGwoc2VsZWN0b3IsIEApIiwiIyBUT0RPOiBSZW5hbWUgdGhpcyBjbGFzcyBzbyB0aGVyZSBhcmVuJ3QgbmFtZXNwYWNlIGNvbmZsaWN0cy5cbmNsYXNzIFRleHRMYXllciBleHRlbmRzIExheWVyXG5cdFx0XG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRAZG9BdXRvU2l6ZSA9IGZhbHNlXG5cdFx0QGRvQXV0b1NpemVIZWlnaHQgPSBmYWxzZVxuXHRcdG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IGlmIG9wdGlvbnMuc2V0dXAgdGhlbiBcImhzbGEoNjAsIDkwJSwgNDclLCAuNClcIiBlbHNlIFwidHJhbnNwYXJlbnRcIlxuXHRcdG9wdGlvbnMuY29sb3IgPz0gXCJyZWRcIlxuXHRcdG9wdGlvbnMubGluZUhlaWdodCA/PSAxLjI1XG5cdFx0b3B0aW9ucy5mb250RmFtaWx5ID89IFwiSGVsdmV0aWNhXCJcblx0XHRvcHRpb25zLmZvbnRTaXplID89IDIwXG5cdFx0b3B0aW9ucy50ZXh0ID89IFwiVXNlIGxheWVyLnRleHQgdG8gYWRkIHRleHRcIlxuXHRcdHN1cGVyIG9wdGlvbnNcblx0XHRAc3R5bGUud2hpdGVTcGFjZSA9IFwicHJlLWxpbmVcIiAjIGFsbG93IFxcbiBpbiAudGV4dFxuXHRcdEBzdHlsZS5vdXRsaW5lID0gXCJub25lXCIgIyBubyBib3JkZXIgd2hlbiBzZWxlY3RlZFxuXHRcdFxuXHRzZXRTdHlsZTogKHByb3BlcnR5LCB2YWx1ZSwgcHhTdWZmaXggPSBmYWxzZSkgLT5cblx0XHRAc3R5bGVbcHJvcGVydHldID0gaWYgcHhTdWZmaXggdGhlbiB2YWx1ZStcInB4XCIgZWxzZSB2YWx1ZVxuXHRcdEBlbWl0KFwiY2hhbmdlOiN7cHJvcGVydHl9XCIsIHZhbHVlKVxuXHRcdGlmIEBkb0F1dG9TaXplIHRoZW4gQGNhbGNTaXplKClcblx0XHRcblx0Y2FsY1NpemU6IC0+XG5cdFx0c2l6ZUFmZmVjdGluZ1N0eWxlcyA9XG5cdFx0XHRsaW5lSGVpZ2h0OiBAc3R5bGVbXCJsaW5lLWhlaWdodFwiXVxuXHRcdFx0Zm9udFNpemU6IEBzdHlsZVtcImZvbnQtc2l6ZVwiXVxuXHRcdFx0Zm9udFdlaWdodDogQHN0eWxlW1wiZm9udC13ZWlnaHRcIl1cblx0XHRcdHBhZGRpbmdUb3A6IEBzdHlsZVtcInBhZGRpbmctdG9wXCJdXG5cdFx0XHRwYWRkaW5nUmlnaHQ6IEBzdHlsZVtcInBhZGRpbmctcmlnaHRcIl1cblx0XHRcdHBhZGRpbmdCb3R0b206IEBzdHlsZVtcInBhZGRpbmctYm90dG9tXCJdXG5cdFx0XHRwYWRkaW5nTGVmdDogQHN0eWxlW1wicGFkZGluZy1sZWZ0XCJdXG5cdFx0XHR0ZXh0VHJhbnNmb3JtOiBAc3R5bGVbXCJ0ZXh0LXRyYW5zZm9ybVwiXVxuXHRcdFx0Ym9yZGVyV2lkdGg6IEBzdHlsZVtcImJvcmRlci13aWR0aFwiXVxuXHRcdFx0bGV0dGVyU3BhY2luZzogQHN0eWxlW1wibGV0dGVyLXNwYWNpbmdcIl1cblx0XHRcdGZvbnRGYW1pbHk6IEBzdHlsZVtcImZvbnQtZmFtaWx5XCJdXG5cdFx0XHRmb250U3R5bGU6IEBzdHlsZVtcImZvbnQtc3R5bGVcIl1cblx0XHRcdGZvbnRWYXJpYW50OiBAc3R5bGVbXCJmb250LXZhcmlhbnRcIl1cblx0XHRjb25zdHJhaW50cyA9IHt9XG5cdFx0aWYgQGRvQXV0b1NpemVIZWlnaHQgdGhlbiBjb25zdHJhaW50cy53aWR0aCA9IEB3aWR0aFxuXHRcdHNpemUgPSBVdGlscy50ZXh0U2l6ZSBAdGV4dCwgc2l6ZUFmZmVjdGluZ1N0eWxlcywgY29uc3RyYWludHNcblx0XHRpZiBAc3R5bGUudGV4dEFsaWduIGlzIFwicmlnaHRcIlxuXHRcdFx0QHdpZHRoID0gc2l6ZS53aWR0aFxuXHRcdFx0QHggPSBAeC1Ad2lkdGhcblx0XHRlbHNlXG5cdFx0XHRAd2lkdGggPSBzaXplLndpZHRoXG5cdFx0QGhlaWdodCA9IHNpemUuaGVpZ2h0XG5cblx0QGRlZmluZSBcImF1dG9TaXplXCIsXG5cdFx0Z2V0OiAtPiBAZG9BdXRvU2l6ZVxuXHRcdHNldDogKHZhbHVlKSAtPiBcblx0XHRcdEBkb0F1dG9TaXplID0gdmFsdWVcblx0XHRcdGlmIEBkb0F1dG9TaXplIHRoZW4gQGNhbGNTaXplKClcblx0QGRlZmluZSBcImF1dG9TaXplSGVpZ2h0XCIsXG5cdFx0c2V0OiAodmFsdWUpIC0+IFxuXHRcdFx0QGRvQXV0b1NpemUgPSB2YWx1ZVxuXHRcdFx0QGRvQXV0b1NpemVIZWlnaHQgPSB2YWx1ZVxuXHRcdFx0aWYgQGRvQXV0b1NpemUgdGhlbiBAY2FsY1NpemUoKVxuXHRAZGVmaW5lIFwiY29udGVudEVkaXRhYmxlXCIsXG5cdFx0c2V0OiAoYm9vbGVhbikgLT5cblx0XHRcdEBfZWxlbWVudC5jb250ZW50RWRpdGFibGUgPSBib29sZWFuXG5cdFx0XHRAaWdub3JlRXZlbnRzID0gIWJvb2xlYW5cblx0XHRcdEBvbiBcImlucHV0XCIsIC0+IEBjYWxjU2l6ZSgpIGlmIEBkb0F1dG9TaXplXG5cdEBkZWZpbmUgXCJ0ZXh0XCIsXG5cdFx0Z2V0OiAtPiBAX2VsZW1lbnQudGV4dENvbnRlbnRcblx0XHRzZXQ6ICh2YWx1ZSkgLT5cblx0XHRcdEBfZWxlbWVudC50ZXh0Q29udGVudCA9IHZhbHVlXG5cdFx0XHRAZW1pdChcImNoYW5nZTp0ZXh0XCIsIHZhbHVlKVxuXHRcdFx0aWYgQGRvQXV0b1NpemUgdGhlbiBAY2FsY1NpemUoKVxuXHRAZGVmaW5lIFwiZm9udEZhbWlseVwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5mb250RmFtaWx5XG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImZvbnRGYW1pbHlcIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJmb250U2l6ZVwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5mb250U2l6ZS5yZXBsYWNlKFwicHhcIixcIlwiKVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJmb250U2l6ZVwiLCB2YWx1ZSwgdHJ1ZSlcblx0QGRlZmluZSBcImxpbmVIZWlnaHRcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUubGluZUhlaWdodCBcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwibGluZUhlaWdodFwiLCB2YWx1ZSlcblx0QGRlZmluZSBcImZvbnRXZWlnaHRcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUuZm9udFdlaWdodCBcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwiZm9udFdlaWdodFwiLCB2YWx1ZSlcblx0QGRlZmluZSBcImZvbnRTdHlsZVwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5mb250U3R5bGVcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwiZm9udFN0eWxlXCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwiZm9udFZhcmlhbnRcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUuZm9udFZhcmlhbnRcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwiZm9udFZhcmlhbnRcIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJwYWRkaW5nXCIsXG5cdFx0c2V0OiAodmFsdWUpIC0+IFxuXHRcdFx0QHNldFN0eWxlKFwicGFkZGluZ1RvcFwiLCB2YWx1ZSwgdHJ1ZSlcblx0XHRcdEBzZXRTdHlsZShcInBhZGRpbmdSaWdodFwiLCB2YWx1ZSwgdHJ1ZSlcblx0XHRcdEBzZXRTdHlsZShcInBhZGRpbmdCb3R0b21cIiwgdmFsdWUsIHRydWUpXG5cdFx0XHRAc2V0U3R5bGUoXCJwYWRkaW5nTGVmdFwiLCB2YWx1ZSwgdHJ1ZSlcblx0QGRlZmluZSBcInBhZGRpbmdUb3BcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUucGFkZGluZ1RvcC5yZXBsYWNlKFwicHhcIixcIlwiKVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJwYWRkaW5nVG9wXCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwicGFkZGluZ1JpZ2h0XCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLnBhZGRpbmdSaWdodC5yZXBsYWNlKFwicHhcIixcIlwiKVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJwYWRkaW5nUmlnaHRcIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJwYWRkaW5nQm90dG9tXCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLnBhZGRpbmdCb3R0b20ucmVwbGFjZShcInB4XCIsXCJcIilcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwicGFkZGluZ0JvdHRvbVwiLCB2YWx1ZSwgdHJ1ZSlcblx0QGRlZmluZSBcInBhZGRpbmdMZWZ0XCIsXG5cdFx0Z2V0OiAtPiBAc3R5bGUucGFkZGluZ0xlZnQucmVwbGFjZShcInB4XCIsXCJcIilcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwicGFkZGluZ0xlZnRcIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJ0ZXh0QWxpZ25cIixcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwidGV4dEFsaWduXCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwidGV4dFRyYW5zZm9ybVwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS50ZXh0VHJhbnNmb3JtIFxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJ0ZXh0VHJhbnNmb3JtXCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwibGV0dGVyU3BhY2luZ1wiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5sZXR0ZXJTcGFjaW5nLnJlcGxhY2UoXCJweFwiLFwiXCIpXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImxldHRlclNwYWNpbmdcIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJsZW5ndGhcIiwgXG5cdFx0Z2V0OiAtPiBAdGV4dC5sZW5ndGhcblxuY29udmVydFRvVGV4dExheWVyID0gKGxheWVyLCBkZWJ1ZykgLT5cblxuXHQjIENyZWF0ZSBhIHRleHQgbGF5ZXIgd2l0aCBhbGwgdGhlIGJhc2ljIHByb3BlcnRpZXMuXG5cdHQgPSBuZXcgVGV4dExheWVyXG5cdFx0bmFtZTogbGF5ZXIubmFtZVxuXHRcdGZyYW1lOiBsYXllci5mcmFtZVxuXHRcdHBhcmVudDogbGF5ZXIucGFyZW50XG5cdFx0dGV4dDogbGF5ZXIuX2luZm8ubWV0YWRhdGEuc3RyaW5nXG5cblx0IyBPYmplY3QgZm9yIHN0eWxlIHByb3BzLlxuXHRzdHlsZU9iaiA9IHt9XG5cdFxuXHQjIEdldCBDU1MgZnJvbSBtZXRhZGF0YS5cblx0Y3NzID0gbGF5ZXIuX2luZm8ubWV0YWRhdGEuY3NzXG5cblx0IyBHbyB0aHJvdWdoIGVhY2ggcnVsZVxuXHRjc3MuZm9yRWFjaCAocnVsZSkgLT5cblxuXHRcdCMgRGl0Y2ggdGhlIGR1bWIgbGF5ZXIgbmFtZS5cblx0XHRyZXR1cm4gaWYgXy5pbmNsdWRlcyBydWxlLCAnLyonXG5cdFx0XG5cdFx0IyBTcGxpdCB0aGUga2V5IGFuZCB2YWx1ZSBvdXRcblx0XHRhcnIgPSBydWxlLnNwbGl0KCc6ICcpXG5cdFx0XG5cdFx0I0Zvcm1hdCB0aGUga2V5IGFuZCB2YWx1ZSBwcm9wZXJseVxuXHRcdHByb3AgPSBfLmNhbWVsQ2FzZShhcnJbMF0pXG5cdFx0dmFsdWUgPSBhcnJbMV0ucmVwbGFjZSgnOycsJycpXG5cdFx0XG5cdFx0I0NvbnZlcnQgdG8gbnVtYmVycyBmb3IgbnVtZXJpYyBwcm9wZXJ0aWVzXG5cdFx0aWYgW1wiZm9udFNpemVcIixcImxldHRlclNwYWNpbmdcIixcImxpbmVIZWlnaHRcIl0uaW5kZXhPZihwcm9wKSA+IC0xXG5cdFx0XHR2YWx1ZSA9IHBhcnNlSW50KHZhbHVlKSBcblxuXHRcdCMgU2V0IHRoZSBrZXkgYW5kIHZhbHVlIGluIHN0eWxlT2JqXG5cdFx0c3R5bGVPYmpbcHJvcF0gPSB2YWx1ZVxuXHRcdFxuXHQjIFNldCB0aGUgbGluZS1oZWlnaHQgYXMgYSBwcm9wb3J0aW9uIGluc3RlYWQgb2YgcGl4ZWwgdmFsdWUuXG5cdGlmIHN0eWxlT2JqLmhhc093blByb3BlcnR5KFwibGluZUhlaWdodFwiKVxuXHRcdHN0eWxlT2JqW1wibGluZUhlaWdodFwiXSA9ICBzdHlsZU9iai5saW5lSGVpZ2h0IC8gc3R5bGVPYmouZm9udFNpemVcblx0ZWxzZVxuXHRcdHN0eWxlT2JqW1wibGluZUhlaWdodFwiXSA9IDEuM1xuIFx0XHQjIFRPRE86IEZpbmQgYSB3YXkgdG8gcHJvcGVybHkgc2V0IHRleHQgbGluZS1oZWlnaHQgZm9yIGF1dG8gdmFsdWVzIGluIFNrZXRjaC5cbiBcdFx0IyBDdXJyZW50bHkgYXV0byBsaW5lLWhlaWdodHMgdmFyeSBieSBmb250LCBzbyB0aGlzIGlzIGp1c3Qgc2V0dGluZyBhIGZhbGxiYWNrIGFyYml0cmFyaWx5LlxuXHRcblx0XG5cdCMgU2V0IHRoZSBwcm9wZXJ0aWVzIGZvciBldmVyeSBrZXkgaW4gc3R5bGVPYmpcblx0Zm9yIGtleSwgdmFsIG9mIHN0eWxlT2JqXG5cdFx0dFtrZXldID0gdmFsXG5cblx0IyBPZmZzZXRzIHRvIGNvbXBlbnNhdGUgZm9yIFNrZXRjaCdzIHBhZGRpbmcuXG5cdHQueSAtPSAodC5mb250U2l6ZSAvIHQubGluZUhlaWdodCkgLyAoNCAtIHQubGluZUhlaWdodClcblx0dC54IC09IHQuZm9udFNpemUgKiAwLjA3XG5cdHQud2lkdGggKz0gdC5mb250U2l6ZSAqIDAuNVxuXG5cdCMgU2V0IHVwIGRlYnVnOiBpZiB0cnVlLCBpdCBkb2Vzbid0IGRlc3Ryb3kgdGhlIGxheWVyIHNvIHlvdSBjYW5cblx0IyBtYW51YWxseSBwb3NpdGlvbiBsaW5lLWhlaWdodCBhbmQgc3R1ZmYuICBIZWxwZnVsLlxuXHRpZiBkZWJ1ZyB0aGVuIGxheWVyLm9wYWNpdHkgPSAuNSBlbHNlIGxheWVyLmRlc3Ryb3koKVxuXHRcblx0cmV0dXJuIHRcblxuTGF5ZXI6OmNvbnZlcnRUb1RleHRMYXllciA9IChkZWJ1ZykgLT4gY29udmVydFRvVGV4dExheWVyKEAsIGRlYnVnKVxuXG5jb252ZXJ0VGV4dExheWVycyA9IChvYmosIGRlYnVnKSAtPlxuXHRmb3IgcHJvcCxsYXllciBvZiBvYmpcblx0XHRpZiBsYXllci5faW5mby5raW5kIGlzIFwidGV4dFwiXG5cdFx0XHRvYmpbcHJvcF0gPSBjb252ZXJ0VG9UZXh0TGF5ZXIobGF5ZXIsIGRlYnVnKVxuXG5cbiMgQmFja3dhcmRzIGNvbXBhYmlsaXR5LiBSZXBsYWNlZCBieSBjb252ZXJ0VG9UZXh0TGF5ZXIoKVxuTGF5ZXI6OmZyYW1lQXNUZXh0TGF5ZXIgPSAocHJvcGVydGllcykgLT5cbiAgICB0ID0gbmV3IFRleHRMYXllclxuICAgIHQuZnJhbWUgPSBAZnJhbWVcbiAgICB0LnN1cGVyTGF5ZXIgPSBAc3VwZXJMYXllclxuICAgIF8uZXh0ZW5kIHQscHJvcGVydGllc1xuICAgIEBkZXN0cm95KClcbiAgICB0XG5cbmV4cG9ydHMuVGV4dExheWVyID0gVGV4dExheWVyXG5leHBvcnRzLmNvbnZlcnRUZXh0TGF5ZXJzID0gY29udmVydFRleHRMYXllcnNcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG5cdGFsbDogLT4gRnJhbWVyLkN1cnJlbnRDb250ZXh0LmxheWVyc1xuXG5cdHdpdGhOYW1lOiAobmFtZSkgLT5cbiBcdFx0Xy5maWx0ZXIgQGFsbCgpLCAobGF5ZXIpIC0+IFxuIFx0XHRcdGlmIGxheWVyLm5hbWUgaXMgbmFtZSB0aGVuIHRydWVcblxuXHRjb250YWluaW5nOiAobmFtZSkgLT5cblx0XHRfLmZpbHRlciBAYWxsKCksIChsYXllcikgLT4gXG5cdFx0XHRpZiBsYXllci5uYW1lLmluZGV4T2YobmFtZSkgaXNudCAtMSB0aGVuIHRydWVcblxuXHR3aXRoV29yZDogKG5hbWUsIGRlbGltaXRlciA9ICdfJykgLT5cblx0XHRib3RoID0gZGVsaW1pdGVyK25hbWUrZGVsaW1pdGVyXG5cdFx0ZW5kID0gbmFtZStkZWxpbWl0ZXJcblx0XHRzdGFydCA9IGRlbGltaXRlcituYW1lXG5cblx0XHRfLmZpbHRlciBAYWxsKG5hbWUpLCAobGF5ZXIpIC0+XG5cdFx0XHRpZiBsYXllci5uYW1lIGlzIG5hbWUgdGhlbiB0cnVlXG5cdFx0XHRlbHNlIGlmIGxheWVyLm5hbWUuaW5kZXhPZihib3RoKSBpc250IC0xIHRoZW4gdHJ1ZVxuXHRcdFx0ZWxzZSBpZiBsYXllci5uYW1lLmluZGV4T2YoZW5kKSBpcyAwIHRoZW4gdHJ1ZVxuXHRcdFx0ZWxzZSBpZiBsYXllci5uYW1lLmluZGV4T2Yoc3RhcnQpIGlzIGxheWVyLm5hbWUubGVuZ3RoLXN0YXJ0Lmxlbmd0aCB0aGVuIHRydWVcblx0XHRcblx0c3RhcnRpbmdXaXRoOiAobmFtZSkgLT5cblx0XHRfLmZpbHRlciBAYWxsKCksIChsYXllcikgLT4gXG5cdFx0XHRpZiBsYXllci5uYW1lLnN1YnN0cmluZygwLG5hbWUubGVuZ3RoKSBpcyBuYW1lIHRoZW4gdHJ1ZVxuXG5cdGVuZGluZ1dpdGg6IChuYW1lKSAtPlxuXHRcdF8uZmlsdGVyIEBhbGwoKSwgKGxheWVyKSAtPiBcblx0XHRcdGlmIGxheWVyLm5hbWUuaW5kZXhPZihuYW1lLCBsYXllci5uYW1lLmxlbmd0aCAtIG5hbWUubGVuZ3RoKSBpc250IC0xIHRoZW4gdHJ1ZVxuXG5cdHdpdGhTdGF0ZTogKHN0YXRlKSAtPiBcblx0XHRfLmZpbHRlciBAYWxsKCksIChsYXllcikgLT5cblx0XHRcdGxheWVyU3RhdGVzID0gbGF5ZXIuc3RhdGVzLl9vcmRlcmVkU3RhdGVzXG5cdFx0XHRpZiBsYXllclN0YXRlcy5pbmRleE9mKHN0YXRlKSBpc250IC0xIHRoZW4gdHJ1ZVxuXG5cdHdpdGhDdXJyZW50U3RhdGU6IChzdGF0ZSkgLT4gXG5cdFx0Xy5maWx0ZXIgQGFsbCgpLCAobGF5ZXIpIC0+XG5cdFx0XHRjdXJyZW50U3RhdGUgPSBsYXllci5zdGF0ZXMuY3VycmVudFxuXHRcdFx0aWYgY3VycmVudFN0YXRlLmluZGV4T2Yoc3RhdGUpIGlzbnQgLTEgdGhlbiB0cnVlXG5cblx0d2l0aFN1cGVyTGF5ZXI6IChuYW1lKSAtPlxuXHRcdG1hdGNoaW5nTGF5ZXJzID0gW11cblx0XHRmb3IgbGF5ZXIgaW4gQHdpdGhOYW1lKG5hbWUpXG5cdFx0XHRtYXRjaGluZ0xheWVycyA9IG1hdGNoaW5nTGF5ZXJzLmNvbmNhdChsYXllci5zdWJMYXllcnMpXG5cblx0d2l0aFN1YkxheWVyOiAobmFtZSkgLT5cblx0XHRtYXRjaGluZ0xheWVycyA9IFtdXG5cdFx0Zm9yIGxheWVyIGluIEB3aXRoTmFtZShuYW1lKVxuXHRcdFx0aWYgbWF0Y2hpbmdMYXllcnMuaW5kZXhPZihsYXllci5zdXBlckxheWVyKSBpcyAtMVxuXHRcdFx0XHRtYXRjaGluZ0xheWVycy5wdXNoKGxheWVyLnN1cGVyTGF5ZXIpXG5cblx0d2hlcmU6IChvYmopIC0+XG5cdFx0Xy53aGVyZSBGcmFtZXIuQ3VycmVudENvbnRleHQuZ2V0TGF5ZXJzKCksIG9ialxuXG5cdGdldDogKG5hbWUpIC0+XG5cdFx0QHdpdGhOYW1lKG5hbWUpWzBdXG59XG5cbkxheWVyOjpzd2l0Y2hQcmVmaXggPSAobmV3UHJlZml4LCBkZWxpbWl0ZXIgPSAnXycpIC0+XG5cdG5hbWUgPSB0aGlzLm5hbWVcblx0bmV3TmFtZSA9IG5ld1ByZWZpeCArIG5hbWUuc2xpY2UgbmFtZS5pbmRleE9mIGRlbGltaXRlclxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHMuZ2V0IG5ld05hbWVcblxuIyBCeSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svc2hvcnRjdXRzLWZvci1mcmFtZXJcbkxheWVyOjpmaW5kU3ViTGF5ZXIgPSAobmVlZGxlLCByZWN1cnNpdmUgPSB0cnVlKSAtPlxuICAjIFNlYXJjaCBkaXJlY3QgY2hpbGRyZW5cbiAgZm9yIHN1YkxheWVyIGluIEBzdWJMYXllcnNcbiAgICByZXR1cm4gc3ViTGF5ZXIgaWYgc3ViTGF5ZXIubmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmVlZGxlLnRvTG93ZXJDYXNlKCkpIGlzbnQgLTEgXG4gICMgUmVjdXJzaXZlbHkgc2VhcmNoIGNoaWxkcmVuIG9mIGNoaWxkcmVuXG4gIGlmIHJlY3Vyc2l2ZVxuICAgIGZvciBzdWJMYXllciBpbiBAc3ViTGF5ZXJzXG4gICAgICByZXR1cm4gc3ViTGF5ZXIuZmluZFN1YkxheWVyKG5lZWRsZSwgcmVjdXJzaXZlKSBpZiBzdWJMYXllci5maW5kU3ViTGF5ZXIobmVlZGxlLCByZWN1cnNpdmUpXG4gICAgICBcbkxheWVyOjpmaW5kID0gKG5lZWRsZSwgcmVjdXJzaXZlID0gdHJ1ZSApIC0+IEBmaW5kU3ViTGF5ZXIgbmVlZGxlLCByZWN1cnNpdmUgPSB0cnVlXG4gICAgICBcbkxheWVyOjpmaW5kU3VwZXJMYXllciA9IChuZWVkbGUsIHJlY3Vyc2l2ZSA9IHRydWUpIC0+XG4gICMgU2VhcmNoIGRpcmVjdCBjaGlsZHJlblxuICByZXR1cm4gQHN1cGVyTGF5ZXIgaWYgQHN1cGVyTGF5ZXIubmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmVlZGxlLnRvTG93ZXJDYXNlKCkpIGlzbnQgLTEgXG4gICMgUmVjdXJzaXZlbHkgc2VhcmNoIGNoaWxkcmVuIG9mIGNoaWxkcmVuXG4gIGlmIHJlY3Vyc2l2ZVxuICBcdHJldHVybiBAc3VwZXJMYXllci5maW5kU3VwZXJMYXllcihuZWVkbGUsIHJlY3Vyc2l2ZSkgaWYgQHN1cGVyTGF5ZXIuZmluZFN1cGVyTGF5ZXIobmVlZGxlLCByZWN1cnNpdmUpIiwiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFLQUE7QURBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtFQUVoQixHQUFBLEVBQUssU0FBQTtXQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUM7RUFBekIsQ0FGVztFQUloQixRQUFBLEVBQVUsU0FBQyxJQUFEO1dBQ1Is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
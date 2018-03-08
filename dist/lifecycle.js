/*!
 * Lifecycle.js v0.1.0
 * https://github.com/fengyuanchen/lifecycle.js
 *
 * Copyright (c) 2018 Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2018-03-08T13:09:08.391Z
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Lifecycle = factory());
}(this, (function () { 'use strict';

var DEFAULTS = {
  /**
   * Indicate if start the lifecycle automatically when initialized or not.
   * @type {boolean}
   * @default false
   */
  autoStart: false,

  /**
   * Indicate if execute the lifecycle stage's hooks when stage changed or not.
   * @type {boolean}
   * @default false
   */
  autoEmit: false,

  /**
   * Indicate if end the lifecycle automatically when the current stage is the last one or not.
   * @type {boolean}
   * @default false
   */
  autoEnd: false
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Check if the given value is a string.
 * @param {*} value - The value to check.
 * @returns {boolean} Return `true` if the given value is a string, else `false`.
 */
function isString(value) {
  return typeof value === 'string';
}

/**
 * Check if the given value is an object.
 * @param {*} value - The value to check.
 * @returns {boolean} Return `true` if the given value is an object, else `false`.
 */
function isObject(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Check if the given value is a plain object.
 * @param {*} value - The value to check.
 * @returns {boolean} Return `true` if the given value is a plain object, else `false`.
 */

function isPlainObject(value) {
  if (!isObject(value)) {
    return false;
  }

  try {
    var _constructor = value.constructor;
    var prototype = _constructor.prototype;


    return _constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
  } catch (e) {
    return false;
  }
}

/**
 * Check if the given value is a function.
 * @param {*} value - The value to check.
 * @returns {boolean} Return `true` if the given value is a function, else `false`.
 */
function isFunction(value) {
  return typeof value === 'function';
}

/**
 * Extend the given object.
 * @param {*} obj - The object to be extended.
 * @param {*} args - The rest objects which will be merged to the first object.
 * @returns {Object} The extended object.
 */
var assign = Object.assign || function assign(obj) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (isObject(obj) && args.length > 0) {
    args.forEach(function (arg) {
      Object.keys(arg).forEach(function (key) {
        obj[key] = arg[key];
      });
    });
  }

  return obj;
};

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var REGEXP_SPACES = /\s\s*/g;
var NAMESPACE = 'lifecycle';

/**
 * Create a new Lifecycle.
 * @class
 */

var Lifecycle = function () {
  /**
   * Construct the Lifecycle.
   * @param {Object} target - The lifecycle target
   * @param {Array|Object} stages - The lifecycle stages
   * @param {Object} [options] - The lifecycle options
   */
  function Lifecycle(target, stages, options) {
    var _this = this;

    _classCallCheck(this, Lifecycle);

    if (!isObject(target)) {
      throw new Error('Invalid ' + NAMESPACE + ' target: ' + target);
    }

    this.target = target;
    this.active = false;
    this.hooks = {};

    if (isPlainObject(stages)) {
      this.stages = Object.keys(stages);
      this.on(stages);
    } else if (Array.isArray(stages)) {
      this.stages = stages;
    } else {
      throw new Error('Invalid ' + NAMESPACE + ' stages: ' + stages);
    }

    this.options = assign({}, DEFAULTS, options);
    this.minIndex = 0;
    this.maxIndex = Math.max(this.minIndex, this.stages.length - 1);
    this.stage = '';

    Object.defineProperty(this, 'index', {
      get: function get() {
        return _this.stages.indexOf(_this.stage);
      },
      set: function set(index) {
        if (!_this.active || index === _this.index) {
          return;
        }

        var stage = _this.stages[index];

        if (stage) {
          _this.stage = stage;

          if (_this.options.autoEmit) {
            _this.emit(stage);
          }

          if (index >= _this.maxIndex && _this.options.autoEnd) {
            _this.end();
          }
        }
      }
    });

    if (this.options.autoStart) {
      this.start();
    }
  }

  /**
   * Start the lifecycle.
   * @returns {Lifecycle} The lifecycle instance.
   */


  _createClass(Lifecycle, [{
    key: 'start',
    value: function start() {
      if (!this.active) {
        this.active = true;
        this.index = 0;
      }

      return this;
    }

    /**
     * End the lifecycle.
     * @returns {Lifecycle} The lifecycle instance.
     */

  }, {
    key: 'end',
    value: function end() {
      if (this.active) {
        this.index = this.maxIndex;
        this.active = false;
      }

      return this;
    }

    /**
     * Move to the previous lifecycle stage.
     * @returns {Lifecycle} The lifecycle instance.
     */

  }, {
    key: 'prev',
    value: function prev() {
      if (this.active && this.index > this.minIndex) {
        this.index -= 1;
      }

      return this;
    }

    /**
     * Move to the next lifecycle stage.
     * @returns {Lifecycle} The lifecycle instance.
     */

  }, {
    key: 'next',
    value: function next() {
      if (this.active && this.index < this.maxIndex) {
        this.index += 1;
      }

      return this;
    }

    /**
     * Go to the given stage.
     * @param {string} stage - The target stage.
     * @returns {Lifecycle} The lifecycle instance.
     */

  }, {
    key: 'goto',
    value: function goto(stage) {
      if (this.active && stage) {
        var index = this.stages.indexOf(stage);

        if (index >= 0 && index <= this.maxIndex) {
          this.index = index;
        }
      }

      return this;
    }

    /**
     * Add hook(s) to the given stage(s).
     * @param {string|Array|Object} stage - The target stage(s).
     * @param {Function|Array} [hook] - The hook(s) to add.
     * @param {Object} [options] - The options.
     * @param {boolean} [options.once=false] - Indicate if the hook will only be executed once or not.
     * @param {boolean} [options.prepend=false] - Indicate if prepend the current hook(s)
     * to the existing hook list or not.
     * @returns {Lifecycle} The lifecycle instance.
     */

  }, {
    key: 'on',
    value: function on(stage, hook) {
      var _this2 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
        once: false,
        prepend: false
      };

      var stages = [];

      if (isString(stage)) {
        stages = stage.trim().split(REGEXP_SPACES);
      } else if (Array.isArray(stage)) {
        stages = stages.concat(stage);
      } else if (isPlainObject(stage)) {
        if (isPlainObject(hook)) {
          options = hook;
        }

        Object.keys(stage).forEach(function (key) {
          _this2.on(key, stage[key], options);
        });
        return this;
      } else {
        throw new Error('Invalid ' + NAMESPACE + ' stage type: ' + stage);
      }

      var hooks = [];

      if (isFunction(hook)) {
        hooks.push(hook);
      } else if (Array.isArray(hook)) {
        hooks = hook;
      } else {
        throw new Error('Invalid ' + NAMESPACE + ' stage hook: ' + hook);
      }

      stages.forEach(function (type) {
        if (!type) {
          return;
        }

        var list = _this2.hooks[type];
        var hookOptions = assign({
          once: false,
          prepend: false
        }, options);

        if (list) {
          hooks.reverse().forEach(function (hookFn) {
            if (isFunction(hookFn)) {
              list.slice().forEach(function (item) {
                if (item.hook === hookFn) {
                  list.splice(list.indexOf(item), 1);
                }
              });

              var item = {
                type: type,
                hook: hookFn,
                options: hookOptions
              };

              if (hookOptions.prepend) {
                list.unshift(item);
              } else {
                list.push(item);
              }
            }
          });
        } else {
          _this2.hooks[type] = hooks.map(function (hookFn) {
            return {
              type: type,
              hook: hookFn,
              options: hookOptions
            };
          });
        }
      });

      return this;
    }

    /**
     * Add hook(s) to the given stage(s) and remove the hook(s) when emitted.
     * @param {string|Array|Object} stage - The target stage(s).
     * @param {Function|Array} [hook] - The hook(s) to add.
     * @param {Object} [options] - The options.
     * @returns {Lifecycle} The lifecycle instance.
     */

  }, {
    key: 'once',
    value: function once(stage, hook, options) {
      return this.on(stage, hook, assign({}, options, {
        once: true
      }));
    }

    /**
     * Remove hook(s) from the given stage(s).
     * @param {string|Array|Object} stage - The target stage(s).
     * @param {Function|Array} [hook] - The hook(s) to remove.
     * @returns {Lifecycle} The lifecycle instance.
     */

  }, {
    key: 'off',
    value: function off(stage, hook) {
      var _this3 = this;

      var stages = [];

      if (isString(stage)) {
        stages = stage.trim().split(REGEXP_SPACES);
      } else if (Array.isArray(stage)) {
        stages = stages.concat(stage);
      } else if (isPlainObject(stage)) {
        Object.keys(stage).forEach(function (key) {
          _this3.off(key, stage[key]);
        });
        return this;
      }

      if (stages.length > 0) {
        var hooks = [];

        if (isFunction(hook)) {
          hooks.push(hook);
        } else if (Array.isArray(hook)) {
          hooks = hook;
        }

        stages.forEach(function (type) {
          var list = _this3.hooks[type];

          if (list) {
            if (hooks.length > 0) {
              hooks.forEach(function (hookFn) {
                if (isFunction(hookFn)) {
                  list.forEach(function (item, index) {
                    if (item.hook === hookFn) {
                      list.splice(index, 1);
                    }
                  });
                }
              });
            } else {
              delete _this3.hooks[type];
            }
          }
        });
      } else {
        this.hooks = {};
      }

      return this;
    }

    /**
     * Emit hook(s) on the given stage(s).
     * @param {string|Array} stage - The target stage(s).
     * @param {Array} [args] - The parameters for passing to each hook.
     * @returns {*} The return values.
     */

  }, {
    key: 'emit',
    value: function emit() {
      var _this4 = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var stage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.stage;

      var returns = [];

      if (this.active && stage) {
        var stages = [];

        if (isString(stage)) {
          stages = stage.trim().split(REGEXP_SPACES);
        } else if (Array.isArray(stage)) {
          stages = stages.concat(stage);
        }

        if (stages.length > 0) {
          returns = stages.map(function (type) {
            var list = _this4.hooks[type];
            var results = void 0;

            if (list) {
              results = list.map(function (item, index) {
                var hook = item.hook;


                if (item.options.once) {
                  list.splice(index, 1);
                }

                return hook.apply(_this4.target, args);
              });
            }

            return results;
          });
        }
      }

      return returns.length > 1 ? returns : returns[0];
    }

    /**
     * Check if the given stage is the current active stage.
     * @param {string} stage - The target stage.
     * @returns {boolean} Return `true` if the stage is active, else `false`.
     */

  }, {
    key: 'is',
    value: function is(stage) {
      return this.stage === stage;
    }
  }]);

  return Lifecycle;
}();

return Lifecycle;

})));

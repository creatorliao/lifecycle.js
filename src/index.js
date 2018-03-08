import DEFAULTS from './defaults';
import {
  assign,
  isFunction,
  isObject,
  isPlainObject,
  isString,
} from './utilities';

const REGEXP_SPACES = /\s\s*/g;
const NAMESPACE = 'lifecycle';

/**
 * Create a new Lifecycle.
 * @class
 */
export default class Lifecycle {
  /**
   * Construct the Lifecycle.
   * @param {Object} target - The lifecycle target
   * @param {Array|Object} stages - The lifecycle stages
   * @param {Object} [options] - The lifecycle options
   */
  constructor(target, stages, options) {
    if (!isObject(target)) {
      throw new Error(`Invalid ${NAMESPACE} target: ${target}`);
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
      throw new Error(`Invalid ${NAMESPACE} stages: ${stages}`);
    }

    this.options = assign({}, DEFAULTS, options);
    this.minIndex = 0;
    this.maxIndex = Math.max(this.minIndex, this.stages.length - 1);
    this.stage = '';

    Object.defineProperty(this, 'index', {
      get: () => this.stages.indexOf(this.stage),
      set: (index) => {
        if (!this.active || index === this.index) {
          return;
        }

        const stage = this.stages[index];

        if (stage) {
          this.stage = stage;

          if (this.options.autoEmit) {
            this.emit(stage);
          }

          if (index >= this.maxIndex && this.options.autoEnd) {
            this.end();
          }
        }
      },
    });

    if (this.options.autoStart) {
      this.start();
    }
  }

  /**
   * Start the lifecycle.
   * @returns {Lifecycle} The lifecycle instance.
   */
  start() {
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
  end() {
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
  prev() {
    if (this.active && this.index > this.minIndex) {
      this.index -= 1;
    }

    return this;
  }

  /**
   * Move to the next lifecycle stage.
   * @returns {Lifecycle} The lifecycle instance.
   */
  next() {
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
  goto(stage) {
    if (this.active && stage) {
      const index = this.stages.indexOf(stage);

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
  on(stage, hook, options = {
    once: false,
    prepend: false,
  }) {
    let stages = [];

    if (isString(stage)) {
      stages = stage.trim().split(REGEXP_SPACES);
    } else if (Array.isArray(stage)) {
      stages = stages.concat(stage);
    } else if (isPlainObject(stage)) {
      if (isPlainObject(hook)) {
        options = hook;
      }

      Object.keys(stage).forEach((key) => {
        this.on(key, stage[key], options);
      });
      return this;
    } else {
      throw new Error(`Invalid ${NAMESPACE} stage type: ${stage}`);
    }

    let hooks = [];

    if (isFunction(hook)) {
      hooks.push(hook);
    } else if (Array.isArray(hook)) {
      hooks = hook;
    } else {
      throw new Error(`Invalid ${NAMESPACE} stage hook: ${hook}`);
    }

    stages.forEach((type) => {
      if (!type) {
        return;
      }

      const list = this.hooks[type];
      const hookOptions = assign({
        once: false,
        prepend: false,
      }, options);

      if (list) {
        hooks.reverse().forEach((hookFn) => {
          if (isFunction(hookFn)) {
            list.slice().forEach((item) => {
              if (item.hook === hookFn) {
                list.splice(list.indexOf(item), 1);
              }
            });

            const item = {
              type,
              hook: hookFn,
              options: hookOptions,
            };

            if (hookOptions.prepend) {
              list.unshift(item);
            } else {
              list.push(item);
            }
          }
        });
      } else {
        this.hooks[type] = hooks.map(hookFn => ({
          type,
          hook: hookFn,
          options: hookOptions,
        }));
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
  once(stage, hook, options) {
    return this.on(stage, hook, assign({}, options, {
      once: true,
    }));
  }

  /**
   * Remove hook(s) from the given stage(s).
   * @param {string|Array|Object} stage - The target stage(s).
   * @param {Function|Array} [hook] - The hook(s) to remove.
   * @returns {Lifecycle} The lifecycle instance.
   */
  off(stage, hook) {
    let stages = [];

    if (isString(stage)) {
      stages = stage.trim().split(REGEXP_SPACES);
    } else if (Array.isArray(stage)) {
      stages = stages.concat(stage);
    } else if (isPlainObject(stage)) {
      Object.keys(stage).forEach((key) => {
        this.off(key, stage[key]);
      });
      return this;
    }

    if (stages.length > 0) {
      let hooks = [];

      if (isFunction(hook)) {
        hooks.push(hook);
      } else if (Array.isArray(hook)) {
        hooks = hook;
      }

      stages.forEach((type) => {
        const list = this.hooks[type];

        if (list) {
          if (hooks.length > 0) {
            hooks.forEach((hookFn) => {
              if (isFunction(hookFn)) {
                list.forEach((item, index) => {
                  if (item.hook === hookFn) {
                    list.splice(index, 1);
                  }
                });
              }
            });
          } else {
            delete this.hooks[type];
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
  emit(stage = this.stage, ...args) {
    let returns = [];

    if (this.active && stage) {
      let stages = [];

      if (isString(stage)) {
        stages = stage.trim().split(REGEXP_SPACES);
      } else if (Array.isArray(stage)) {
        stages = stages.concat(stage);
      }

      if (stages.length > 0) {
        returns = stages.map((type) => {
          const list = this.hooks[type];
          let results;

          if (list) {
            results = list.map((item, index) => {
              const { hook } = item;

              if (item.options.once) {
                list.splice(index, 1);
              }

              return hook.apply(this.target, args);
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
  is(stage) {
    return this.stage === stage;
  }
}

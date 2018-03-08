/**
 * Check if the given value is a string.
 * @param {*} value - The value to check.
 * @returns {boolean} Return `true` if the given value is a string, else `false`.
 */
export function isString(value) {
  return typeof value === 'string';
}

/**
 * Check if the given value is an object.
 * @param {*} value - The value to check.
 * @returns {boolean} Return `true` if the given value is an object, else `false`.
 */
export function isObject(value) {
  return typeof value === 'object' && value !== null;
}

const { hasOwnProperty } = Object.prototype;

/**
 * Check if the given value is a plain object.
 * @param {*} value - The value to check.
 * @returns {boolean} Return `true` if the given value is a plain object, else `false`.
 */
export function isPlainObject(value) {
  if (!isObject(value)) {
    return false;
  }

  try {
    const { constructor } = value;
    const { prototype } = constructor;

    return constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
  } catch (e) {
    return false;
  }
}

/**
 * Check if the given value is a function.
 * @param {*} value - The value to check.
 * @returns {boolean} Return `true` if the given value is a function, else `false`.
 */
export function isFunction(value) {
  return typeof value === 'function';
}

/**
 * Extend the given object.
 * @param {*} obj - The object to be extended.
 * @param {*} args - The rest objects which will be merged to the first object.
 * @returns {Object} The extended object.
 */
export const assign = Object.assign || function assign(obj, ...args) {
  if (isObject(obj) && args.length > 0) {
    args.forEach((arg) => {
      Object.keys(arg).forEach((key) => {
        obj[key] = arg[key];
      });
    });
  }

  return obj;
};

export default {
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
  autoEnd: false,
};

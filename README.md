# Lifecycle.js

[![Build Status](https://travis-ci.org/fengyuanchen/lifecycle.js.svg)](https://travis-ci.org/fengyuanchen/lifecycle.js) [![Downloads](https://img.shields.io/npm/dm/lifecycle.js.svg)](https://www.npmjs.com/package/lifecycle.js) [![Version](https://img.shields.io/npm/v/lifecycle.js.svg)](https://www.npmjs.com/package/lifecycle.js)

> JavaScript lifecycle manager.

## Table of contents

- [Main](#main)
- [Getting started](#getting-started)
- [Options](#options)
- [Methods](#methods)
- [Browser and Node.js support](#browser-and-nodejs-support)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [License](#license)

## Main

```text
dist/
├── lifecycle.js        (UMD)
├── lifecycle.min.js    (UMD, compressed)
├── lifecycle.common.js (CommonJS, default)
└── lifecycle.esm.js    (ES Module)
```

## Getting started

### Installation

```shell
npm install lifecycle.js
```

### Usage

#### Syntax

```js
new Lifecycle(target, stages[, options])
```

- **target**
  - Type: `Object`
  - The lifecycle target.

- **stages**
  - Type: `Array`
  - The lifecycle stages.

- **options** (optional)
  - Type: `Object`
  - The lifecycle options. Check out the available [options](#options).

#### Example

```js
const target = {};
const stages = ['created', 'mounted', 'destroyed'];
const lifecycle = new Lifecycle(target, stages, {
  autoEmit: true,
});

lifecycle.on('created', () => {
  console.log('created');
}).start();

lifecycle.on('mounted', () => {
  console.log('mounted');
}).next();

lifecycle.on('destroyed', () => {
  console.log('destroyed');
}).end();
```

[⬆ back to top](#table-of-contents)

## Options

### autoStart

- Type: `Boolean`
- Default: `false`

Indicate if start the lifecycle automatically when initialized or not.

### autoEmit

- Type: `Boolean`
- Default: `false`

Indicate if execute the lifecycle stage's hooks when stage changed or not.

### autoEnd

- Type: `Boolean`
- Default: `false`

Indicate if end the lifecycle automatically when the current stage is the last one or not.

[⬆ back to top](#table-of-contents)

## Methods

> If a method doesn't need to return any value, it will return the lifecycle instance (`this`) for chain composition.

### start()

Start the lifecycle.

### end()

End the lifecycle.

### prev()

Move to the previous lifecycle stage.

### next()

Move to the next lifecycle stage.

### goto(stage)

- **stage**:
  - Type: `String`
  - The target stage.

Go to the given stage.

### on(stage[, hook, [options]])

- **stage**:
  - Type: `String`, `Array` or `Object`
  - The target stage(s).
- **hook**:
  - Type: `Function` or `Array`
  - The hook(s) to add.
  - This is optional when the first argument is an object.
- **options** (optional):
  - Type: `Object`
  - Properties:
    - `once`:
      - Type: `Boolean`
      - Default: `false`
      - Indicate if the hook(s) will only be executed once or not.
    - `prepend`:
      - Type: `Boolean`
      - Default: `false`
      - Indicate if prepend the current hook(s) to the stage hook list or not.
      - If it is set to `true`, the current hook(s) will be executed first before others when emitted.

Add hook(s) to the given stage(s).

```js
lifecycle.on('created', () => {});
lifecycle.on('mounted updated', () => {});
lifecycle.on(['mounted', 'updated'], () => {});
lifecycle.on('created', () => {}, {
  prepend: true,
});
lifecycle.on('mounted', [() => {}, () => {}], {
  once: true,
});
lifecycle.on({
  created() {},
  mounted: [() => {}, () => {}],
}, {
  once: true,
});
```

### once(stage[, hook, [options]])

- **stage**:
  - Type: `String`, `Array` or `Object`
  - The target stage(s).
- **hook**:
  - Type: `Function` or `Array`
  - The hook(s) to add.
  - This is optional when the first argument is an object.
- **options** (optional):
  - Type: `Object`
  - Properties:
    - `prepend`:
      - Type: `Boolean`
      - Default: `false`
      - Indicate if prepend the current hook(s) to the existing hook list or not.
      - If it is set to `true`, the current hook(s) will be executed first before others when emitted.

Add hook(s) to the given stage(s) and remove the hook(s) when emitted.

### off(stage[, hook])

- **stage**:
  - Type: `String`, `Array` or `Object`
  - The target stage(s).
- **hook**:
  - Type: `Function` or `Array`
  - The hook(s) to remove.
  - This is optional when the first argument is an object.

Remove hook(s) from the given stage(s).

### emit(stage, ...args)

- **stage**:
  - Type: `String` or `Array`
  - The target stage(s).
- **args**:
  - Type: `Array`
  - The parameters for passing to each hook.
- (return value):
  - If only one hook is executed, then the return value of the hook will be returned.
  - If more than one hook is executed, then an array with the return values of the hooks will be returned.

Emit hook(s) on the given stage(s).

```js
lifecycle.once('created', (...args) => {
  console.log(args);
  // > [3, 1, 2]
  return args.sort().pop();
});

console.log(lifecycle.emit('created', 3, 1, 2));
// > 3

lifecycle.once('updated', [
  (...args) => args.sort().pop(),
  (...args) => args.sort().pop(),
]);

console.log(lifecycle.emit('updated', 3, 1, 2));
// > [3, 3]
```

### is(stage)

- **stage**:
  - Type: `String`
  - The target stage.
- (return value):
  - Type: `Boolean`

Check if the given stage is the current active stage.

```js
if (lifecycle.is('mounted')) {
  // do something...
}
```

[⬆ back to top](#table-of-contents)

## Browser and Node.js support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)
- Edge (latest)
- Internet Explorer 9+
- Node.js 6+

## Contributing

Please read through our [contributing guidelines](.github/CONTRIBUTING.md).

## Versioning

Maintained under the [Semantic Versioning guidelines](http://semver.org/).

## License

[MIT](http://opensource.org/licenses/MIT) © [Chen Fengyuan](http://chenfengyuan.com)

[⬆ back to top](#table-of-contents)

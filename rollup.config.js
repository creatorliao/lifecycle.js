const babel = require('rollup-plugin-babel');
const pkg = require('./package');

const now = new Date();
const banner = `/*!
 * Lifecycle.js v${pkg.version}
 * https://github.com/${pkg.repository}
 *
 * Copyright (c) ${now.getFullYear()} ${pkg.author.name}
 * Released under the ${pkg.license} license
 *
 * Date: ${now.toISOString()}
 */
`;

module.exports = {
  input: 'src/index.js',
  output: [
    {
      banner,
      file: 'dist/lifecycle.js',
      format: 'umd',
      name: 'Lifecycle',
    },
    {
      banner,
      file: 'dist/lifecycle.common.js',
      format: 'cjs',
    },
    {
      banner,
      file: 'dist/lifecycle.esm.js',
      format: 'es',
    },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};

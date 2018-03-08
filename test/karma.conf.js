const puppeteer = require('puppeteer');
const rollupConfig = require('../rollup.config');

process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = (config) => {
  config.set({
    autoWatch: false,
    basePath: '..',
    browsers: ['ChromeHeadlessWithoutSandbox'],
    customLaunchers: {
      ChromeHeadlessWithoutSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },
    files: [
      'dist/lifecycle.js',
      'test/specs/**/*.spec.js',
    ],
    frameworks: ['mocha', 'chai'],
    preprocessors: {
      'test/specs/**/*.spec.js': ['rollup'],
    },
    reporters: ['mocha'],
    rollupPreprocessor: {
      plugins: rollupConfig.plugins,
      output: {
        format: 'iife',
        name: 'Lifecycle',
        sourcemap: 'inline',
      },
    },
    singleRun: true,
  });
};

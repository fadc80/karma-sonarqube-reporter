// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-mocha'),
      require('karma-mocha-reporter'),
      require('karma-chrome-launcher'),
      require('karma-sonarqube-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/app1'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    sonarqubeReporter: {
      basePath: 'src/app',        // test files folder
      filePattern: '**/*spec.ts', // test files glob pattern
      encoding: 'utf-8',          // test files encoding
      outputFolder: 'reports',    // report destination
      legacyMode: false,          // report for Sonarqube < 6.2 (disabled)
      reportName: (metadata) => { // report name callback
        return 'test.xml';
      }
    },
    reporters: ['progress', 'mocha', 'sonarqube'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    restartOnFileChange: true
  });
};

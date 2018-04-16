# karma-sonarqube-reporter
A [Karma][1] reporter plugin for generating [SonarQube][2] generic test execution data.  

[![Build Status](https://travis-ci.org/fadc80/karma-sonarqube-reporter.svg?branch=master)](https://travis-ci.org/fadc80/karma-sonarqube-reporter)

## Installation

Just save the `karma-sonarqube-reporter` as a development dependency

`npm install karma-sonarqube-reporter --save-dev`

## Configuration

Adjust your `karma.conf.js` file: 

**Create new plugin entry**

```typescript
plugins: [
  require('karma-sonarqube-reporter')
]
```

**Add parameters**

```typescript
sonarqubeReporter: {
  basePath: 'src/app',        // test folder 
  filePattern: '**/*spec.ts', // test file pattern
  outputFolder: 'reports',    // reports destination
  encoding: 'utf-8'           // file format
}
```

**Set reports section**

```typescript
reporters: ['sonarqube']
```

If you prefer a full example:

```typescript
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-sonarqube-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    client:{
      clearContext: false
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    sonarqubeReporter: {
      basePath: 'src/app',
      outputFolder: 'reports',
      filePattern: '**/*spec.ts',
      encoding: 'utf-8'
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress', 'kjhtml', 'sonarqube'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome', 'Firefox'],
    singleRun: false
  });
};
```

## Running

If your project uses [Angular CLI][3] run `ng test` and check the output folder.

```command
$ ls reports
chrome.65.0.3325.linux.0.0.0.xml
firefox.54.0.0.linux.0.0.0.xml
```

The report files' schema is defined on the [SonarQube Generic Test Data][4] page.

Add the following property to your `sonar-project.properties`: 

```
sonar.testExecutionReportPaths= \
  reports/chrome.65.0.3325.linux.0.0.0.xml, \
  reports/firefox.54.0.0.linux.0.0.0.xml
```

Finally, start [SonarQube Scanner][5] on your project folder.
  
That's all!

[1]: https://karma-runner.github.io/2.0/index.html
[2]: https://www.sonarqube.org/
[3]: https://github.com/angular/angular-cli
[4]: https://docs.sonarqube.org/display/SONAR/Generic+Test+Data#GenericTestData-GenericExecution
[5]: https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner

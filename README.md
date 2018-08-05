# karma-sonarqube-reporter
A [Karma][1] reporter plugin for generating [SonarQube][2] generic test reports.

[![Build Status](https://travis-ci.org/fadc80/karma-sonarqube-reporter.svg?branch=master)](https://travis-ci.org/fadc80/karma-sonarqube-reporter)
[![Coverage Status](https://coveralls.io/repos/github/fadc80/karma-sonarqube-reporter/badge.svg?branch=master)](https://coveralls.io/github/fadc80/karma-sonarqube-reporter?branch=master)

## Installation

`npm install karma-sonarqube-reporter --save-dev`

## Configuration

Adjust your `karma.conf.js` file:

**Create a new plugin entry**

```typescript
plugins: [
  require('karma-sonarqube-reporter')
]
```

**Add configuration parameters (optional)**

```javascript
// Default configuration
sonarqubeReporter: {
  basePath: 'src/app',        // test files folder
  filePattern: '**/*spec.ts', // test files glob pattern
  outputFolder: 'reports',    // report file destination
  encoding: 'utf-8'           // report file encoding
  reportName: (metadata) => { // report file name callback
    // metadata[0] = browser name
    // metadata[1] = browser version
    // metadata[2] = plataform name
    // metadata[3] = plataform version
    // e.g. firefox.54.0.0.linux.0.0.0.xml
    // e.g. chrome.65.0.3325.linux.0.0.0.xml
    return metadata.concat('xml').join('.');
}
```

Note you can provide a custom `reportName` callback. For example:

```typescript
// Custom report name
(metadata) => {
    // e.g. firefox/result.xml
    // e.g. chrome/result.xml
    return metadata[0].concat('/result.xml');
}
```

**Activate `sonarqube` reporter**

```typescript
reporters: ['sonarqube']
```

Click [here][3] to see a full example.


## Running

If your project uses [Angular CLI][4] run `ng test` and check the output folder.

```command
$ ls reports
chrome.65.0.3325.linux.0.0.0.xml
firefox.54.0.0.linux.0.0.0.xml
```
The report files' schema is defined on the [SonarQube Generic Test Data][5] page.

Add the following property to your `sonar-project.properties`:

```
sonar.testExecutionReportPaths= \
  reports/firefox.54.0.0.linux.0.0.0.xml, \
  reports/chrome.65.0.3325.linux.0.0.0.xml
```

Finally, start [SonarQube Scanner][6] on your project folder.

That's all!

[1]: https://karma-runner.github.io/2.0/index.html
[2]: https://www.sonarqube.org/
[3]: https://github.com/fadc80/karma-sonarqube-reporter/blob/master/karma.conf.js
[4]: https://github.com/angular/angular-cli
[5]: https://docs.sonarqube.org/display/SONAR/Generic+Test+Data#GenericTestData-GenericExecution
[6]: https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner

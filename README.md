# karma-sonarqube-reporter
[![npm version](https://img.shields.io/npm/v/karma-sonarqube-reporter.svg?style=round-square)](https://www.npmjs.com/package/karma-sonarqube-reporter)
[![Build Status](https://travis-ci.org/fadc80/karma-sonarqube-reporter.svg?branch=master)](https://travis-ci.org/fadc80/karma-sonarqube-reporter)
[![Coverage Status](https://coveralls.io/repos/github/fadc80/karma-sonarqube-reporter/badge.svg?branch=master)](https://coveralls.io/github/fadc80/karma-sonarqube-reporter?branch=master)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=karma-sonarqube-reporter&metric=alert_status)](https://sonarcloud.io/dashboard/index/karma-sonarqube-reporter)
> [Karma][1] reporter plugin for generating [SonarQube][2] generic test reports.

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
  encoding: 'utf-8',          // test files encoding
  outputFolder: 'reports',    // report destination
  legacyMode: false,          // report for Sonarqube < 6.2 (disabled)
  reportName: (metadata) => { // report name callback
    /**
     * Report metadata array:
     * - metadata[0] = browser name
     * - metadata[1] = browser version
     * - metadata[2] = plataform name
     * - metadata[3] = plataform version
     */
     return metadata.concat('xml').join('.');
  }
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
firefox.54.0.0.linux.0.0.0.xml
chrome.65.0.3325.linux.0.0.0.xml
```

The current report files' schema is defined on the [SonarQube Generic Test Data][5] page.

Add one of the following properties to your `sonar-project.properties`:

| Legacy Mode | Property                                  |
| ----------- | ----------------------------------------- |
| false       | sonar.testExecutionReportPaths            |
| true        | sonar.genericcoverage.unitTestReportPaths |

Note report paths should be passed in a comma-delimited.

Finally, start [SonarQube Scanner][6] on your project folder.

That's all!

[1]: https://karma-runner.github.io/2.0/index.html
[2]: https://www.sonarqube.org/
[3]: https://github.com/fadc80/karma-sonarqube-reporter/blob/master/karma.conf.js
[4]: https://github.com/angular/angular-cli
[5]: https://docs.sonarqube.org/display/SONAR/Generic+Test+Data#GenericTestData-GenericExecution
[6]: https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner
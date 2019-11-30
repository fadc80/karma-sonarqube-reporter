# karma-sonarqube-reporter
[![npm version](https://img.shields.io/npm/v/karma-sonarqube-reporter.svg?style=round-square)](https://www.npmjs.com/package/karma-sonarqube-reporter)
[![Build Status](https://travis-ci.org/fadc80/karma-sonarqube-reporter.svg?branch=master)](https://travis-ci.org/fadc80/karma-sonarqube-reporter)
[![Coverage Status](https://coveralls.io/repos/github/fadc80/karma-sonarqube-reporter/badge.svg?branch=master)](https://coveralls.io/github/fadc80/karma-sonarqube-reporter?branch=master)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=karma-sonarqube-reporter&metric=alert_status)](https://sonarcloud.io/dashboard/index/karma-sonarqube-reporter)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=round-square)](#contributors)
> [Karma][1] reporter plugin for generating [SonarQube][2] generic test reports.

## Requirements

Node.js >= 8.10.0

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

**Add configuration parameters**

```javascript
// Default configuration
sonarqubeReporter: {
  basePath: 'src/app',        // test files folder
  filePattern: '**/*spec.ts', // test files glob pattern
  encoding: 'utf-8',          // test files encoding
  outputFolder: 'reports',    // report destination
  legacyMode: false,          // report for Sonarqube < 6.2 (disabled)
  reportName: (metadata) => { // report name callback, accepts also a string (reportName: 'report.xml') to generate a single file
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
chrome.65.0.3325.linux.0.0.0.xml
firefox.54.0.0.linux.0.0.0.xml
```

The current report files' schema is defined on the [SonarQube Generic Test Data][5] page.

Add to your `sonar-project.properties` one of the following properties:

| Legacy Mode | Property                                  |
| ----------- | ----------------------------------------- |
| false       | sonar.testExecutionReportPaths            |
| true        | sonar.genericcoverage.unitTestReportPaths |

Note report paths should be passed in a comma-delimited.

Finally, start [SonarQube Scanner][6] on your project folder.

[Contributions](contributing.md) are welcome!

That's all!

[1]: https://karma-runner.github.io/2.0/index.html
[2]: https://www.sonarqube.org/
[3]: https://github.com/fadc80/karma-sonarqube-reporter/blob/master/karma.conf.js
[4]: https://github.com/angular/angular-cli
[5]: https://docs.sonarqube.org/display/SONAR/Generic+Test+Data#GenericTestData-GenericExecution
[6]: https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/sohansoni"><img src="https://avatars2.githubusercontent.com/u/11642039?v=4" width="100px;" alt="Sohan Soni"/><br /><sub><b>Sohan Soni</b></sub></a><br /><a href="https://github.com/fadc80/karma-sonarqube-reporter/commits?author=sohansoni" title="Code">💻</a></td>
    <td align="center"><a href="http://gearsdigital.com"><img src="https://avatars3.githubusercontent.com/u/965069?v=4" width="100px;" alt="Steffen Giers"/><br /><sub><b>Steffen Giers</b></sub></a><br /><a href="https://github.com/fadc80/karma-sonarqube-reporter/commits?author=gearsdigital" title="Code">💻</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
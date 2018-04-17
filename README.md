# karma-sonarqube-reporter
A [Karma][1] reporter plugin for generating [SonarQube][2] generic test execution data.  

[![Build Status](https://travis-ci.org/fadc80/karma-sonarqube-reporter.svg?branch=master)](https://travis-ci.org/fadc80/karma-sonarqube-reporter)

## Installation

Just save the `karma-sonarqube-reporter` as a development dependency

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

```typescript
sonarqubeReporter: {
  basePath: 'src/app',        // test folder 
  filePattern: '**/*spec.ts', // test file pattern
  outputFolder: 'reports',    // reports destination
  encoding: 'utf-8'           // file format
}
```

**Enable the `sonarqube` reporter**

```typescript
reporters: ['sonarqube']
```

Check a [karma.conf.js][3] full example


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
  reports/chrome.65.0.3325.linux.0.0.0.xml, \
  reports/firefox.54.0.0.linux.0.0.0.xml
```

Finally, start [SonarQube Scanner][6] on your project folder.
  
That's all!

[1]: https://karma-runner.github.io/2.0/index.html
[2]: https://www.sonarqube.org/
[3]: https://github.com/fadc80/karma-sonarqube-reporter/blob/master/karma.conf.js
[4]: https://github.com/angular/angular-cli
[5]: https://docs.sonarqube.org/display/SONAR/Generic+Test+Data#GenericTestData-GenericExecution
[6]: https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner

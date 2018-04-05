# karma-sonarqube-reporter
A [Karma][1] reporter plugin for generating [Sonarqube][2] generic test execution data.

## Installation

Just save it as a development dependency running the following command

`npm install git+https://github.com/fadc80/karma-sonarqube-reporter.git --save-dev`

## Configuration

Adjust your `karma.conf.js` configuration file: 

1. Create new plugin entry

```typescript
plugins: [
      require('karma-sonarqube-reporter')
]
```

2. Add a configuration object

```typescript
sonarqubeReporter: {
  basePath: 'src/app',       // test folder 
  filePattern: '**/*spec.ts' // test file pattern
  outputFolder: 'reports',   // reports destination
  encoding: 'utf-8'          // file format
}
```

3. Enable it

```typescript
reporters: ['sonarqube']
```

Usually, a `karma.conf.js` file looks like this:

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
    browsers: ['Chrome'],
    singleRun: false
  });
};
```

## Running

If you are using angular-cli you can the `npm run test` command.

Check the XML files generated on the output folder.

```command
ls reports
chrome.65.0.3325.linux.0.0.0.xml
firefox.54.0.0.linux.0.0.0.xml
```

Note the report files' schema is defined on the [Sonarqube Generic Test Data][3] page.

Add the following property to your `sonar-project.properties`: 

```
sonar.testExecutionReportPaths= \
  reports/chrome.65.0.3325.linux.0.0.0.xml, \
  reports/firefox.54.0.0.linux.0.0.0.xml
```

Finally, run `sonnar-scanner` to upload your test reports to a sonarqube server.
  
That's all!

[1]: https://karma-runner.github.io/2.0/index.html
[2]: https://www.sonarqube.org/
[3]: https://docs.sonarqube.org/display/SONAR/Generic+Test+Data#GenericTestData-GenericExecution

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var js2xmlparser = require('js2xmlparser');

var pathfinder = require('./lib/path-finder');
var reportbuilder = require('./lib/report-builder');

const BASE_PATH = 'src/app/';
const OUTPUT_FOLDER = '/reports';
const FILE_PATTERN = '**/*spec.ts';
const ENCODING = 'utf-8';

var sonarqubeReporter = function(baseReporterDecorator, config, 
  logger, helper, formatError) { 
  
  var sonarqubeConfig = config.sonarqubeReporter || {};
  
  var pattern = path.join(
    sonarqubeConfig.basePath || BASE_PATH, 
    sonarqubeConfig.filePattern || FILE_PATTERN);

  var outputFolder = sonarqubeConfig.outputFolder || OUTPUT_FOLDER;
  var encoding = sonarqubeConfig.encoding || ENCODING;

  var reports = {};

  baseReporterDecorator(this);

  this.adapters = [];

  this.onSpecComplete = function(browser, result) {
    if (result.success) {
      this.specSuccess(browser, result);     
    }
    else if (result.skipped) {
      this.specSkipped(browser, result);
    }
    else {
      this.specFailure(browser, result);     
    }
  }

  this.specSuccess = function(browser, result) {
    var report = browserReport(reports, browser);
    var path = pathfinder.testFilePath(pattern, encoding, result);
    reportFile(report, path).testCase.push(
      reportbuilder.createReportTestCaseSuccess(result));
  }

  this.specSkipped = function(browser, result) {
    var report = browserReport(reports, browser);
    var path = pathfinder.testFilePath(pattern, encoding, result);
    reportFile(report, path).testCase.push(
      reportbuilder.createReportTestCaseSkipped(result));
  };

  this.specFailure = function(browser, result) {
    var report = browserReport(reports, browser);
    var path = pathfinder.testFilePath(pattern, encoding, result);
    reportFile(report, path).testCase.push(
      reportbuilder.createReportTestCaseFailure(result, 
        stacktrace(result, formatError)));
  };

  this.onRunComplete = function(browsersCollection, results) {
      saveReports(reports, outputFolder);
  };
};

function browserReport(reports, browser) {
  var reportKey = Object.keys(reports).find((currentKey) => {
     return currentKey == browser.name }
  );
  if (reportKey == undefined) {
    report = reportbuilder.createReport();
    reports[browser.name] = report;
  }
  return reports[browser.name];
}

function reportFile(report, path) { 
  var reportFile = report.file.find((currentFile) => { 
    return currentFile['@'].path == path
  });
  if (reportFile == undefined) {
    reportFile = reportbuilder.createReportFile(path);
    report.file.push(reportFile);
  }
  return reportFile;
}

function stacktrace(result, formatError) {
  return result.log.reduce((previousLog, currentLog)=> {
    return previousLog + formatError(currentLog);
  });
}

function saveReports(reports, outputFolder) {
  createOutputFolder(outputFolder);
  Object.keys(reports).forEach((browserName)=> {
    fs.writeFileSync(reportFileName(outputFolder, browserName), 
      toXml(reports[browserName]));
  });
}

function createOutputFolder(outputFolder) {
  mkdirp.sync(outputFolder, (error) => {
    if (error) throw error;
  });
}

function reportFileName(outputFolder, browserName) {
  return path.join(outputFolder, formatReportFileName(browserName));
}

function formatReportFileName(reportFileName) {
  return reportFileName.replace(/\s/g, '.').replace(/\(|\)/g,'')
    .toLowerCase() + '.xml';
}

function toXml(report) {
  return js2xmlparser.parse('testExecutions', report);
}

sonarqubeReporter.$inject = [
 'baseReporterDecorator', 
 'config', 
 'logger', 
 'helper', 
 'formatError'
];

module.exports = {
  'reporter:sonarqube': ['type', sonarqubeReporter] 
};

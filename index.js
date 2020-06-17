var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var js2xmlparser = require('js2xmlparser');
var pathfinder = require('./lib/path-finder');
var reportbuilder = require('./lib/report-builder');

const BASE_PATH = 'src/app/';
const OUTPUT_FOLDER = 'reports';
const FILE_PATTERN = '**/*spec.ts';
const ENCODING = 'utf-8';
const LEGACY_MODE = false;

const REPORT_NAME = (metadata) => {
    return metadata.concat('xml').join('.');
}

var sonarqubeReporter = function(baseReporterDecorator, config,
  logger, helper, formatError) {

  var sonarqubeConfig = config.sonarqubeReporter || {};

  var pattern = path.join(
    sonarqubeConfig.basePath || BASE_PATH,
    sonarqubeConfig.filePattern || FILE_PATTERN);

  var outputFolder = sonarqubeConfig.outputFolder || OUTPUT_FOLDER;
  var encoding = sonarqubeConfig.encoding || ENCODING;
  var reportName = (typeof sonarqubeConfig.reportName === 'string')
    ? () => sonarqubeConfig.reportName
    : sonarqubeConfig.reportName || REPORT_NAME;
  var legacyMode = sonarqubeConfig.legacyMode || LEGACY_MODE;

  var paths = pathfinder.parseTestFiles(
    pattern, encoding);

  var reports = {};

  baseReporterDecorator(this);

  this.adapters = [];

  this.onSpecComplete = function(browser, result) {
    if (result.skipped) {
      this.specSkipped(browser, result);
    }
    else if (result.success) {
      this.specSuccess(browser, result);
    }
    else {
      this.specFailure(browser, result);
    }
  }

  this.specSuccess = function(browser, result) {
    var report = browserReport(reports,
      reportName(metadata(browser.name)));
    var path = pathfinder.testFile(paths,
      result.suite[0], result.description);
    if (path !== undefined) {
      reportFile(report, path).testCase.push(
        reportbuilder.createReportTestCaseSuccess(result));
    }
  }

  this.specSkipped = function(browser, result) {
    var report = browserReport(reports,
      reportName(metadata(browser.name)));
    var path = pathfinder.testFile(paths,
      result.suite[0], result.description);
    if (path !== undefined) {
      reportFile(report, path).testCase.push(
        reportbuilder.createReportTestCaseSkipped(result));
    }
  };

  this.specFailure = function(browser, result) {
    var report = browserReport(reports,
      reportName(metadata(browser.name)));
    var path = pathfinder.testFile(paths,
      result.suite[0], result.description);
    if (path !== undefined) {
      reportFile(report, path).testCase.push(
      reportbuilder.createReportTestCaseFailure(result,
        stacktrace(result, formatError)));
      }
    };

  this.onRunComplete = function(browsersCollection, results) {
    saveReports(outputFolder, reports, legacyMode);
  };
};

function browserReport(reports, reportKey) {
  var foundKey = Object.keys(reports).find((key) => {
     return key == reportKey }
  );
  if (foundKey == undefined) {
    reports[reportKey] = reportbuilder.createReport();
  }
  return reports[reportKey];
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
  return result.log.map(formatError).reduce(
    (errors, value)=> { return errors.concat(value) });
}

function saveReports(folder, reports, legacyMode) {
  Object.keys(reports).forEach((report) => {
    saveReport(path.join(folder, report),
      reports[report], legacyMode);
  });
}

function saveReport(filePath, data, legacyMode) {
  createFolder(filePath);
  createFile(filePath, data, legacyMode);
}

function createFolder(filePath) {
  mkdirp.sync(path.dirname(filePath));
}

function createFile(filePath, data, legacyMode) {
  fs.writeFileSync(filePath, toXml(data, legacyMode ?
    'unitTest' : 'testExecutions'));
}

function metadata(report) {
  return report.toLowerCase().replace(/\(|\)/gm,'').split(" ");
}

function toXml(report, rootElementName) {
  return js2xmlparser.parse(rootElementName, report);
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

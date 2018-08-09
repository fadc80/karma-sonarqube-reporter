var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var mock = require('mock-require');

const config1 = {
  sonarqubeReporter: {
    outputFolder: 'reports/config1',
    encoding: 'utf-8',
    legacyMode: false,
    reportName: (metadata) => {
      return metadata[0].concat('.xml');
    }
  }
};

const config2 = {
  sonarqubeReporter: {
    outputFolder: 'reports/config2',
    encoding: 'iso-8859-1',
    legacyMode: true,
    reportName: (metadata) => {
      return metadata[0].concat(
        '/result.xml');
    }
  }
};

describe('Sonarqube reporter tests', function() {
  var reporterDefault;
  var reporterConfig1;
  var reporterConfig2;
  const firefox = 'firefox 1.0.0 (linux 1.0.0)';
  const chrome = 'chrome 1.0.0 (linux 1.0.0)';
  const ie = 'ie 1.0.0 (linux 1.0.0)'
  beforeAll(function() {
    mock('../lib/path-finder', {
      parseTestFiles: function(pattern, encoding) {
        return {
          's1': { 'd1': 'test/file1/path' },
          's2': { 'd2': 'test/file2/path' },
          's3': { 'd3': 'test/file3/path' }
        }
      },
      testFile: function(paths, describe, it) {
        var testFilePath = undefined;
        if (describe == 's1' && it == 'd1') { testFilePath = 'test/file1/path'; }
        if (describe == 's2' && it == 'd2') { testFilePath = 'test/file1/path'; }
        if (describe == 's3' && it == 'd3') { testFilePath = 'test/file3/path'; }
        return testFilePath;
      }
    });
  });
  beforeEach(function() {
    const sonarqubeReporter = mock.reRequire('../index')['reporter:sonarqube'][1];
    const baseReporterDecorator = jasmine.createSpy('baseReporterDecorator');
    const helper = jasmine.createSpy('helper');
    const logger = jasmine.createSpy('logger');
    const formatError = (error) => { return error };
    reporterDefault = initReporter({});
    reporterConfig1 = initReporter(config1);
    reporterConfig2 = initReporter(config2);
    function initReporter(config) {
      var reporter = new sonarqubeReporter(
        baseReporterDecorator, config, helper, logger, formatError);
      spyOn(reporter, "specSuccess").and.callThrough();
      spyOn(reporter, "specSkipped").and.callThrough();
      spyOn(reporter, "specFailure").and.callThrough();
      return reporter;
    };
  });
  afterAll(function() {
    mock.stop('../lib/path-finder');
  });
  afterEach(function() {
    clearReports('reports');
  });
  describe('Reporter using default configuration', function() {
    it('Sonarqube reporter is defined', function() {
      expect(reporterDefault).toBeDefined();
    });
  });
  describe('Reporter using custom configuration 1', function() {
    it('Sonarqube reporter is defined', function() {
      expect(reporterConfig1).toBeDefined();
    });
  });
  describe('Reporter using custom configuration 2', function() {
    it('Sonarqube reporter is defined', function() {
      expect(reporterConfig2).toBeDefined();
    });
  });
  describe('Karma runner configured to single browser', function() {
    describe('Reporter using default configuration', function() {
      it('All test cases passed (firefox)', function() {
        reporterDefault.onSpecComplete({name: firefox}, { fullName: 's1 d1',
          success: true, suite: ['s1'], description: 'd1', time: '1'});
        reporterDefault.onSpecComplete({name: firefox}, { fullName: 's2 d2',
          success: true, suite: ['s2'], description: 'd2', time: '1'});
        reporterDefault.onSpecComplete({name: firefox}, { fullName: 's3 d3',
          success: true, suite: ['s3'], description: 'd3', time: '1'});
        reporterDefault.onRunComplete({}, {});
        // TODO: assert specSuccess arguments
        // TODO: assert report file content
        expect(reporterDefault.specSuccess.calls.count()).toEqual(3);
        expect(isReportFileCreated('reports/firefox.1.0.0.linux.1.0.0.xml')).toBe(true);
      });
    });
    describe('Reporter using custom configuration 1', function() {
      it('All test cases skipped (chrome)', function() {
        reporterConfig1.onSpecComplete({name: chrome}, { fullName: 's1 d1',
          skipped: true, suite: ['s1'], description: 'd1', time: '2'});
        reporterConfig1.onSpecComplete({name: chrome}, { fullName: 's2 d2',
          skipped: true, suite: ['s2'], description: 'd2', time: '2'});
        reporterConfig1.onSpecComplete({name: chrome}, { fullName: 's3 d3',
          skipped: true, suite: ['s3'], description: 'd3', time: '2'});
        reporterConfig1.onRunComplete({}, {});
        // TODO: assert specSuccess arguments
        // TODO: assert report file content
        expect(reporterConfig1.specSkipped.calls.count()).toEqual(3);
        expect(isReportFileCreated('reports/config1/chrome.xml')).toBe(true);
      });
    });
    describe('Reporter using custom configuration 2', function() {
      it('All test cases failed (ie)', function() {
        reporterConfig2.onSpecComplete({name: ie}, { fullName: 's1 d1',
          suite: ['s1'], description: 'd1', time: '3', log: ['e1']});
        reporterConfig2.onSpecComplete({name: ie}, { fullName: 's2 d2',
          suite: ['s2'], description: 'd2', time: '3', log: ['e2']});
        reporterConfig2.onSpecComplete({name: ie}, { fullName: 's3 d3',
          suite: ['s3'], description: 'd3', time: '3', log: ['e3']});
        reporterConfig2.onRunComplete({}, {});
        // TODO: assert specSuccess arguments
        // TODO: assert report file content
        expect(reporterConfig2.specFailure.calls.count()).toEqual(3);
        expect(isReportFileCreated('reports/config2/ie/result.xml')).toBe(true);
      });
    });
  });
  describe('Karma runner configured to multiple browsers', function() {
    describe('Reporter using default configuration', function() {
      it('All test cases passed', function() {
        reporterDefault.onSpecComplete({name: firefox}, { fullName: 's1 d1',
          success: true, suite: ['s1'], description: 'd1', time: '1'});
        reporterDefault.onSpecComplete({name: chrome}, { fullName: 's1 d1',
          success: true, suite: ['s1'], description: 'd1', time: '1'});
        reporterDefault.onSpecComplete({name: ie}, { fullName: 's1 d1',
          success: true, suite: ['s1'], description: 'd1', time: '1'});
        reporterDefault.onRunComplete({}, {});
        // TODO: assert specSuccess arguments
        // TODO: assert report file content
        expect(reporterDefault.specSuccess.calls.count()).toEqual(3);
        expect(isReportFileCreated('reports/firefox.1.0.0.linux.1.0.0.xml')).toBe(true);
        expect(isReportFileCreated('reports/chrome.1.0.0.linux.1.0.0.xml')).toBe(true);
        expect(isReportFileCreated('reports/ie.1.0.0.linux.1.0.0.xml')).toBe(true);
      });
    });
    describe('Reporter using custom configuration 1', function() {
      it('All test cases skipped', function() {
        reporterConfig1.onSpecComplete({name: firefox}, { fullName: 's2 d2',
          skipped: true, suite: ['s2'], description: 'd2', time: '2'});
        reporterConfig1.onSpecComplete({name: chrome}, { fullName: 's2 d2',
          skipped: true, suite: ['s2'], description: 'd2', time: '2'});
        reporterConfig1.onSpecComplete({name: ie}, { fullName: 's2 d2',
          skipped: true, suite: ['s2'], description: 'd2', time: '2'});
        reporterConfig1.onRunComplete({}, {});
        // TODO: assert specSuccess arguments
        // TODO: assert report file content
        expect(reporterConfig1.specSkipped.calls.count()).toEqual(3);
        expect(isReportFileCreated('reports/config1/firefox.xml')).toBe(true);
        expect(isReportFileCreated('reports/config1/chrome.xml')).toBe(true);
        expect(isReportFileCreated('reports/config1/ie.xml')).toBe(true);
      });
    });
    describe('Reporter using custom configuration 2', function() {
      it('All test cases failed', function() {
        reporterConfig2.onSpecComplete({name: firefox}, { fullName: 's3 d3',
          suite: ['s3'], description: 'd3', time: '3', log: ['e3']});
        reporterConfig2.onSpecComplete({name: chrome}, { fullName: 's3 d3',
          suite: ['s3'], description: 'd3', time: '3', log: ['e3']});
        reporterConfig2.onSpecComplete({name: ie}, { fullName: 's3 d3',
          suite: ['s3'], description: 'd3', time: '3',
          log: ['e3.1', 'e3.2']});
        reporterConfig2.onRunComplete({}, {});
        // TODO: assert specSuccess arguments
        // TODO: assert report file content
        expect(reporterConfig2.specFailure.calls.count()).toEqual(3);
        expect(isReportFileCreated('reports/config2/firefox/result.xml')).toBe(true);
        expect(isReportFileCreated('reports/config2/chrome/result.xml')).toBe(true);
        expect(isReportFileCreated('reports/config2/ie/result.xml')).toBe(true);
      });
    });
  });
  function isReportFileCreated(filePath) {
    return fs.existsSync(filePath);
  }
  function clearReports(folder) {
    rimraf.sync(folder);
  }
});

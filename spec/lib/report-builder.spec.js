var reportBuilder = require('../../lib/report-builder');
describe('Report builder tests', function() {
  var report;

  beforeEach(function() {
    report = reportBuilder.createReport();
  });

  describe('Creating a new empty report', function() {
    it ('Report defined', function() {
      expect(report).toBeDefined();
    });

    it ('Report version defined as attribute', function() {
      expect(report['@'].version).toBeDefined();
    });

    it ('Report version is equal to 1', function() {
      expect(report['@'].version).toBe('1');
    });

    it ('Report files defined as an array', function() {
      expect(Array.isArray(report.file)).toBe(true);
    });

    it ('Report files is empty', function() {
      expect(report.file.length).toBe(0);
    });
  });
  describe('Creating a report for a single test file', function() {
    const path = 'path/to/single/report';

    beforeEach(function() {
      report.file.push(reportBuilder.createReportFile(path));
    });

    it ('Report file defined', function() {
      expect(report.file[0]).toBeDefined();
    });

    it ('Report file path defined as attribute', function() {
      expect(report.file[0]['@'].path).toBeDefined();
    });

    it ('Report file path defined correctly', function() {
      expect(report.file[0]['@'].path).toBe(path);
    });

    it ('Report contains a single test file', function() {
      expect(report.file.length).toBe(1);
    });
  });
});

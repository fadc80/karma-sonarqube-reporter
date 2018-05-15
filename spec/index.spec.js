var fs = require('fs');
var path = require('path');

var mock = require('mock-require');

const config = {
  sonarqubeReporter: {
    basePath: 'src/app',         // test folder 
    filePattern: '**/*spec.ts',  // test file pattern
    outputFolder: 'tmp/reports', // reports destination
    encoding: 'utf-8'            // file format
  }
}

describe('Sonarqube reporter tests', function() {
  var reporter;
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
        if (describe == 's1' && it == 'd1') {
          testFilePath = 'test/file1/path';
        }
        if (describe == 's2' && it == 'd2') {
          testFilePath = 'test/file1/path';
        }        
        if (describe == 's3' && it == 'd3') {
          testFilePath = 'test/file3/path';
        }
        return testFilePath;
      }
    });
  });
  beforeEach(function() {
    sonarqubeReporter = mock.reRequire('../index')['reporter:sonarqube'][1];
    baseReporterDecorator = jasmine.createSpy('baseReporterDecorator');
    helper = jasmine.createSpy('helper');
    logger = jasmine.createSpy('logger'); 
    formatError = jasmine.createSpy('formatError');
    reporter = new sonarqubeReporter(
      baseReporterDecorator, 
      config, helper, logger, 
      formatError);  
    spyOn(reporter, "specSuccess").and.callThrough();
    spyOn(reporter, "specSkipped").and.callThrough();
    spyOn(reporter, "specFailure").and.callThrough();
  });
  afterAll(function() {
    mock.stop('../lib/path-finder');
  });
  it('Sonarqube reporter is defined', function() {
    expect(reporter).toBeDefined();
  });
  describe('Single browsers', function() {
    it('Report test case success (firefox)', function() {
      reporter.onSpecComplete({name: 'firefox'}, { success: true, suite: ['s1'], 
        description: 'd1', time: '1'}); 
      reporter.onSpecComplete({name: 'firefox'}, { success: true, suite: ['s2'], 
        description: 'd2', time: '1'});
      reporter.onSpecComplete({name: 'firefox'}, { success: true, suite: ['s3'], 
        description: 'd3', time: '1'});
      // TODO: assert specSuccess arguments
      expect(reporter.specSuccess.calls.count()).toEqual(3);    
      reporter.onRunComplete({}, {});
      // TODO: assert report file content
      expect(reportFileCreated('firefox.xml')).toBe(true);  
    });
    it('Report test case skipped (chrome)', function() {    
      reporter.onSpecComplete({name: 'chrome'}, { skipped: true, suite: ['s1'], 
        description: 'd1', time: '2'});
      reporter.onSpecComplete({name: 'chrome'}, { skipped: true, suite: ['s2'], 
        description: 'd2', time: '2'});
      reporter.onSpecComplete({name: 'chrome'}, { skipped: true, suite: ['s3'], 
        description: 'd3', time: '2'});
      // TODO: assert specSkipped arguments
      expect(reporter.specSkipped.calls.count()).toEqual(3);
      reporter.onRunComplete({}, {});
      // TODO: assert report file content
      expect(reportFileCreated('chrome.xml')).toBe(true);
    });
    it('Report rest case failure (ie)', function() {
      reporter.onSpecComplete({name: 'ie'}, { suite: ['s1'], 
        description: 'd1', time: '3', log: ['e1']});
      reporter.onSpecComplete({name: 'ie'}, { suite: ['s2'], 
        description: 'd2', time: '3', log: ['e2']});
      reporter.onSpecComplete({name: 'ie'}, { suite: ['s3'], 
        description: 'd3', time: '3', log: ['e3']});
      // TODO: assert specFailure arguments
      expect(reporter.specFailure).toHaveBeenCalled();
      reporter.onRunComplete({}, {});
      // TODO: assert report file content
      expect(reportFileCreated('ie.xml')).toBe(true);
    });
  });
  describe('Multiple browsers (firefox, chrome, ie)', function() {
    it('Report test case success', function() {
      reporter.onSpecComplete({name: 'firefox'}, { success: true, suite: ['s1'], 
        description: 'd1', time: '1'});
      reporter.onSpecComplete({name: 'chrome'}, { success: true, suite: ['s1'], 
        description: 'd1', time: '1'});
      reporter.onSpecComplete({name: 'ie'}, { success: true, suite: ['s1'], 
        description: 'd1', time: '1'});
      // TODO: assert specSuccess arguments
      expect(reporter.specSuccess.calls.count()).toEqual(3);
      reporter.onRunComplete({}, {});
      // TODO: assert report file content    
      expect(reportFileCreated('firefox.xml')).toBe(true); 
      expect(reportFileCreated('chrome.xml')).toBe(true);
      expect(reportFileCreated('ie.xml')).toBe(true);
    });
    it('Report test case skipped', function() {
      reporter.onSpecComplete({name: 'firefox'}, { skipped: true, suite: ['s2'], 
        description: 'd2', time: '2'});
      reporter.onSpecComplete({name: 'chrome'}, { skipped: true, suite: ['s2'], 
        description: 'd2', time: '2'});
      reporter.onSpecComplete({name: 'ie'}, { skipped: true, suite: ['s2'], 
        description: 'd2', time: '2'});
      // TODO: assert specSkipped arguments
      expect(reporter.specSkipped.calls.count()).toEqual(3);
      reporter.onRunComplete({}, {});
      // TODO: assert report file content
      expect(reportFileCreated('firefox.xml')).toBe(true); 
      expect(reportFileCreated('chrome.xml')).toBe(true);
      expect(reportFileCreated('ie.xml')).toBe(true);
    });
    it('Report rest case failure', function() {
      reporter.onSpecComplete({name: 'firefox'}, { suite: ['s3'], 
        description: 'd3', time: '3', log: ['e3']});
      reporter.onSpecComplete({name: 'chrome'}, { suite: ['s3'], 
        description: 'd3', time: '3', log: ['e3']});
      reporter.onSpecComplete({name: 'ie'}, { suite: ['s3'], 
        description: 'd3', time: '3', log: ['e3.1', 'e3.2']});
      // TODO: assert specFailure arguments
      expect(reporter.specFailure.calls.count()).toEqual(3);
      reporter.onRunComplete({}, {});
      // TODO: assert report file content
      expect(reportFileCreated('firefox.xml')).toBe(true); 
      expect(reportFileCreated('chrome.xml')).toBe(true);
      expect(reportFileCreated('ie.xml')).toBe(true);
    });
  });
  function reportFileCreated(browserName) {
    return fs.existsSync(filePath(browserName));
  }
  function filePath(file) {
    return path.join(configFolder(), file);
  }
  function configFolder() {
    return config.sonarqubeReporter.outputFolder;
  }
});
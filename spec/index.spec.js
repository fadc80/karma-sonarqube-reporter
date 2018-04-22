var fs = require('fs');
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
      testFilePath: function(pattern, encoding, result) {
        return 'test/file/path';
      }
    });
  });

  beforeEach(function() {
    sonarqubeReporter = mock.reRequire('../index')['reporter:sonarqube'][1];

    baseReporterDecorator = jasmine.createSpy('baseReporterDecorator');
    
    helper = jasmine.createSpy('helper');
    logger = jasmine.createSpy('logger'); 
    
    formatError = jasmine.createSpy('formatError');
    
    reporter = new sonarqubeReporter(baseReporterDecorator, config,
      helper, logger, formatError);  

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

  it('Report with single test case success', function() {
    reporter.onSpecComplete({name: 'firefox'}, { success: true, suite: ['s1'], 
      result: { description: 'd1', time: '1'}});
    
    expect(reporter.specSuccess).toHaveBeenCalled();
    
    reporter.onRunComplete({}, {});
    
    expect(reportFileCreated('firefox')).toBe(true);  
  });

  it('Report with single test case skipped', function() {    
    reporter.onSpecComplete({name: 'chrome'}, { skipped: true, suite: ['s2'], 
      result: { description: 'd2', time: '2'}});
    
    expect(reporter.specSkipped).toHaveBeenCalled();

    reporter.onRunComplete({}, {});

    expect(reportFileCreated('chrome')).toBe(true);
  });

  it('Report with single rest case failure', function() {
    reporter.onSpecComplete({name: 'ie'}, { suite: ['s3'], 
      result: { description: 'd3', time: '3'}, log: ['e3']});

    expect(reporter.specFailure).toHaveBeenCalled();

    reporter.onRunComplete({}, {});

    expect(reportFileCreated('ie')).toBe(true);
  });

  function reportFileCreated(browserName) {
    return fs.existsSync(config.sonarqubeReporter.outputFolder+'/'+browserName+'.xml');
  }
});

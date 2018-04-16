var mock = require('mock-require');
var testData = {
  'path/t1.spec.js':'describe("s1", function() { it("d1", function() {}); });',
  'path/t2.spec.js':'describe("s2", function() { it("d2", function() {}); });',
  'path/t3.spec.js':'describe("s3", function() { it("d3", function() {}); });' 	
}

describe('Path finder tests', function() {
  var pathFinder;
  beforeEach(function() {
    mock('glob', { 
      sync: function(pattern) {
        return Object.keys(testData);
      }
    });
    mock('fs', { 
      readFileSync: function(path, encoding) {
        return testData[path];
      }
    });
    pathFinder = require('../../lib/path-finder');
  });
  it('1st test file match suite s1 and description d1', function() {
    expect(pathFinder.testFilePath('**/*.spec.ts', 'utf-8', 
      { suite: ['s1'], description: 'd1'})).toBe('path/t1.spec.js');
  });
  it('2sd test file match suite s2 and description d2', function() {
    expect(pathFinder.testFilePath('**/*.spec.ts', 'utf-8', 
      { suite: ['s2'], description: 'd2'})).toBe('path/t2.spec.js');
  });
  it('3rd test file match suite s3 and description d3', function() {
    expect(pathFinder.testFilePath('**/*.spec.ts', 'utf-8', 
      { suite: ['s3'], description: 'd3'})).toBe('path/t3.spec.js');
  });
  it('Test file not found', function() {
    expect(function() { pathFinder.testFilePath('**/*.spec.ts', 'utf-8', 
      { suite: ['s4'], description: 'd4'})}).toThrow(new Error('Test file not found!'));
  });

});

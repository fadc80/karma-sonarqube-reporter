var mock = require('mock-require');

var testData = {
  'path/t1.spec.js':'describe(\'suite1\', function() { it(\'description1\', function() {}); });',
  'path/t2.spec.js':'describe(\'suite2\', function() { it(\'description2\', function() {}); });',
  'path/t3.spec.js':'describe(\'suite3\', function() { it(\'description3\', function() {}); });',	
  'path/t4.spec.js':'describe(\'\\\'suite4\\\'\', function() { it(\'\\\'description4\\\'\', function() {}); });',
  'path/t5.spec.js':'describe(\'\\\"suite5\\\"\', function() { it(\'\\\"description5\\\"\', function() {}); });',
  'path/t6.spec.js':
    'describe(\'suite6.1\', function() { it(\'description6.1\', function() {}); });' +
    'describe(\'suite6.2\', function() { it(\'description6.2\', function() {}); });' + 
    'describe(\'suite6.3\', function() { it(\'description6.3\', function() {}); });' +
    'describe(\'suite6.4\', function() { describe(\'suite6.4.1\', function() { ' + 
      'it(\'description6.4.1\', function() {}); }); });'   	
}

describe('Path finder tests', function() {
  var pathFinder;

  beforeAll(function() {
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

    pathFinder = mock.reRequire('../../lib/path-finder');
  });

  afterAll(function() {
    mock.stop('glob');
    mock.stop('fs');
  });

  describe('Test files with single test cases', function() {

    it('1st test file match suite 1 and description 1', function() {
      expect(pathFinder.testFilePath('**/*.spec.ts', 'utf-8', 
        { suite: ['suite1'], description: 'description1'})).toBe('path/t1.spec.js');
    });

    it('2sd test file match suite 2 and description 2', function() {
      expect(pathFinder.testFilePath('**/*.spec.ts', 'utf-8', 
        { suite: ['suite2'], description: 'description2'})).toBe('path/t2.spec.js');
    });

    it('3rd test file match suite 3 and description 3', function() {
      expect(pathFinder.testFilePath('**/*.spec.ts', 'utf-8', 
        { suite: ['suite3'], description: 'description3'})).toBe('path/t3.spec.js');
    });

    describe('Test cases with quoted text', function() {
      
      it('4rd test file match suite and description with single quotes', function() {
        expect(pathFinder.testFilePath('**/*.spec.ts', 'utf-8', 
          { suite: ['\'suite4\''], description: '\'description4\''})).toBe('path/t4.spec.js');
      });

       it('5th test file match suite and description with double quotes', function() {
        expect(pathFinder.testFilePath('**/*.spec.ts', 'utf-8', 
          { suite: ['\"suite5\"'], description: '\"description5\"'})).toBe('path/t5.spec.js');
      });

    });

  });

  describe('Test files with multiple test cases', function() {
    
    it('6th test file match suite 6.1 and description 6.1 (sibling)', function() {
      expect(pathFinder.testFilePath('**/*.spec.ts', 'utf-8', 
        { suite: ['suite6.1'], description: 'description6.2'})).toBe('path/t6.spec.js');
    });

    it('6th test file match suite 6.2 and description 6.2 (sibling)', function() {
      expect(pathFinder.testFilePath('**/*.spec.ts', 'utf-8', 
        { suite: ['suite6.2'], description: 'description6.2'})).toBe('path/t6.spec.js');
    });

    it('6th test file match suite 6.3 and description 6.3 (sibling)', function() {
      expect(pathFinder.testFilePath('**/*.spec.ts', 'utf-8', 
        { suite: ['suite6.3'], description: 'description6.3'})).toBe('path/t6.spec.js');
    });

    it('6th test file match suite 6.4 and description 6.4 (nested)', function() {
      expect(pathFinder.testFilePath('**/*.spec.ts', 'utf-8', 
        { suite: ['suite6.4.1'], description: 'description6.4.1'})).toBe('path/t6.spec.js');
    });

  });

  it('Test file not found', function() {
    expect(function() { pathFinder.testFilePath('**/*.spec.ts', 'utf-8', 
      { suite: ['suiteNotFound'], description: 'descriptionNotFound'})})
        .toThrow(new Error('Test file not found!'));
  });

});

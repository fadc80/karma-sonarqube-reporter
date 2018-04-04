var fs = require('fs');
var glob = require('glob');

function testFilePath(pattern, encoding, result) {
    var paths = glob.sync(pattern).filter((path) => {
        var data = testFileData(path, encoding);
        return testFileMatch(data, result);
    });
    if (paths.length == 0) {
        throw new Error("Test file not found!");
    }
    if (paths.length > 1) {
        throw new Error("Multiple test files found!");
    }
    return paths[0];
}
  
function testFileData(path, encoding) {
    return removeNewLines(fs.readFileSync(path, encoding));
}

function removeNewLines(data) {
    return data.replace(/\r?\n|\r/g, '');
}

function testFileMatch(data, result) {
    return testFileMatchDescribe(data, result) && 
        testFileMatchIt(data, result);
}

function testFileMatchDescribe(data, result) {
    return data.match(testDescribePattern(result)) != null;
}

function testFileMatchIt(data, result) {
    return data.match(testItPattern(result)) != null;
}

function testDescribePattern(result) {
    return new RegExp('.*describe\\s*\\(\\s*(?:\'|\")' + 
        result.suite[0], 'gi');
}

function testItPattern(result) {
    return new RegExp('.*it\\s*\\(\\s*(?:\'|\")' + 
        result.description, 'gi');
}
module.exports = {
    testFilePath: testFilePath 
};
var fs = require('fs');
var glob = require('glob');
var cloneRegexp = require('clone-regexp');

function testFilePath(pattern, encoding, result) {
    var filePath = glob.sync(pattern).find((path, index, array) => {
        return testFileMatch(testFileData(path, encoding), result);
    });
    if (filePath == undefined) {
        throw new Error("Test file not found!");
    }
    return filePath;
}
  
function testFileData(path, encoding) {
    return removeNewLines(removeComments(fs.readFileSync(path, encoding)));
}

function testFileMatch(data, result) {
    return matchDescribe(data, result) && matchIt(data, result);
}

function matchDescribe(data, result) {
  return recursiveMatch(data, describePattern(), describeText(result), 0);
}

function matchIt(data, result) {
  return recursiveMatch(data, itPattern(), itText(result), 0);
}

function removeComments(data) {
    return data.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '');
}

function removeNewLines(data) {
    return data.replace(/\r?\n|\r/g, '');
}

function removeSpecialCharacters(data) {
    return data.replace(/\W/g, '');
}

function describePattern() {
  return new RegExp('describe\\s*\\(\\s*(?:\`|\'|\")', 'gi');
}

function itPattern() {
  return new RegExp('it\\s*\\(\\s*(?:\`|\'|\")' , 'gi');
}

function describeText(result) {
  return result.suite [0];
}

function itText(result) {
  return result.description;
}

function recursiveMatch(data, regex, text, index) {
  if (index >= data.length) {
    return false;
  }
  var slicedData = data.slice(index); 
  var indexOf = slicedData.search(regex);
  if (indexOf === -1) {
    return false;
  }
  var regexMatch = cloneRegexp(regex).exec(slicedData);
  if (match(slicedData, text, indexOf + regexMatch[0].length)) {
    return true;
  }
  return recursiveMatch(slicedData, regex, text, 
    indexOf + regexMatch[0].length + text.length);
}

function match(data, text, index) { 
  return removeSpecialCharacters(data.substr(index, text.length+1)) === 
         removeSpecialCharacters(text);
}

module.exports = {
    testFilePath: testFilePath 
};

var fs = require('fs');
var glob = require('glob');

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
  return regexMatch(data, describePattern(), describeText(result));
}

function matchIt(data, result) {
  return regexMatch(data, itPattern(), itText(result));
}

function removeComments(data) {
    return data.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '');
}

function removeNewLines(data) {
    return data.replace(/\r?\n|\r/g, '');
}

function describePattern() {
  return new RegExp('describe\\s*\\(\\s*(?:\`|\'|\")', 'gi');
}

function itPattern() {
  return new RegExp('it\\s*\\(\\s*(?:\`|\'|\")' , 'gi');
}

function describeText(result) {
  return result.suite[0];
}

function itText(result) {
  return result.description;
}

function regexMatch(data, regex, text) {
  while ((result = regex.exec(data)) != null) {
    if (textMatch(data, regex, text)) {
      return true;
    }
  }
  return false;
}

function textMatch(data, regex, text) {
  return regularTextMatch(data, regex, text) ||
         escapedTextMatch(data, regex, text);
}

function regularTextMatch(data, regex, text) {
  return data.substring(regex.lastIndex, regex.lastIndex + text.length) == text;
}

function escapedTextMatch(data, regex, text) {
  return regularTextMatch(data, regex, escapeQuotes(text));
}

function escapeQuotes(str) {
  return str.replace(/\\([\s\S])|("|')/g,"\\$1$2");
}

module.exports = {
    testFilePath: testFilePath 
};

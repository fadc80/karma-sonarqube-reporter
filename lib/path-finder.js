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
  return result.suite[0];
}

function itText(result) {
  return result.description;
}

function regexMatch(data, regex, text) {
  while ((result = regex.exec(data)) != null) {
    regexText = data.substring(regex.lastIndex, 
      regex.lastIndex + text.length);
    if (textMatch(regexText, text)) {
      return true;
    }
  }
  return false;
}

function textMatch(text1, text2) {
  text1 = removeSpecialCharacters(text1); 
  text2 = removeSpecialCharacters(text2);
  var minLength = text1.length <= text2.length ? text1.length : text2.length;
  return text1.substring(0, minLength) === 
         text2.substring(0, minLength);
}

module.exports = {
    testFilePath: testFilePath 
};

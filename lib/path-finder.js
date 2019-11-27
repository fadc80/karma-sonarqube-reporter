var fs = require('fs');
var glob = require('glob');

var customLogger = require('./custom-logger');

const logger = customLogger.init();

function parseTestFiles(pattern, encoding) {
    var paths = {};
    glob.sync(pattern).find((path, index, array) => {
      parseTestFile(paths, path, testFileData(path, encoding));
    });
    return paths;
}

function testFileData(path, encoding) {
    return removeNewLines(removeComments(fs.readFileSync(path, encoding)));
}

function parseTestFile(paths, path, data) {
  var result, regex = regexPattern();
  while ((result = regex.exec(data)) != null) {
    var type = result[2] || result[3];
    var text = result[5];
    if (paths[path] == undefined) {
        paths[path] = { describe: [], it: [] };
    }
    if (type.includes("describe")) {
        paths[path].describe.push(text);
    }
    if (type.includes("it")) {
        paths[path].it.push(text);
    }
  }
}

function testFile(paths, describe, it) {
  var testFile = Object.keys(paths).find(path =>
    exist(paths, path, describe, it));
  if (testFile === undefined) {
    logger.error('Test file path not found! %s | %s | %s',
        JSON.stringify(paths), describe, it);
  }
  return testFile;
}

function exist(paths, path, describe, it) {
    return existDescribe(paths, path, describe) &&
           existIt(paths, path, it);
}

function existDescribe(paths, path, describe) {
    return paths[path].describe.find(element =>
      describe.startsWith(removeEscapedQuotes(element)));
}

function existIt(paths, path, it) {
    return paths[path].it.find(element =>
      it.startsWith(removeEscapedQuotes(element)));
}

function regexPattern() {
  return /((\S{0,2}describe?[^(]+)|(\s\S{0,2}it?[^(]+))\s*\(\s*((?<![\\])[`'"])((?:.(?!(?<![\\])\4))*.?)\4/gi;
}

function removeEscapedQuotes(str) {
  return str.replace(/(?:\\|\\\\)((")|(')|(`))/g,"$1");
}

function removeComments(data) {
    return data.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '');
}

function removeNewLines(data) {
    return data.replace(/\r?\n|\r/g, '');
}

module.exports = {
    parseTestFiles: parseTestFiles,
    testFile: testFile
};

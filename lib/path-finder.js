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
  var templateRegex = templateLiteralRegex();
  while ((result = regex.exec(data)) != null) {
    var type = result[2] || result[3];
    var text = removeMultilineDelimiters(result[4]);
    if (paths[path] == undefined) {
        paths[path] = { describe: [], dynamicDescribe: [], it: [], dynamicIt: [] };
    }
    if (type.includes("describe")) {
        paths[path].describe.push(text);
        if (templateRegex.test(text)) {
          paths[path].dynamicDescribe.push(toDynamicNameRegExp(text));
        }
    }
    if (type.includes("it")) {
        paths[path].it.push(text);
        if (templateRegex.test(text)) {
          paths[path].dynamicIt.push(toDynamicNameRegExp(text));
        }
    }
  }
}

function testFile(paths, describe, it) {
  var testFile = Object.keys(paths).find(path =>
    exist(paths, path, describe, it));
  if (testFile === undefined) {
    logger.error('Test file path not found! %s | %s', describe, it);
  }
  return testFile;
}

function exist(paths, path, describe, it) {
    return existDescribe(paths, path, describe) &&
           existIt(paths, path, it);
}

function existDescribe(paths, path, describe) {
    if (paths[path].describe.find(element =>
        describe === removeEscapedQuotes(element))) {
      return true;
    }
    var dynamicDescribes = paths[path].dynamicDescribe
        .filter(element => element.test(describe));
    if (dynamicDescribes.length > 1) {
      logger.error('Multiple dynamic describes found matching test name! %s', dynamicDescribes);
      return undefined;
    }
    return dynamicDescribes[0];
}

function existIt(paths, path, it) {
  if (paths[path].it.find(element =>
      it === removeEscapedQuotes(element))) {
      return true;
  }
  var dynamicIts = paths[path].dynamicIt
      .filter(element => element.test(it));
  if (dynamicIts.length > 1) {
    logger.error('Multiple dynamic its found matching test name! %s', dynamicIts);
    return undefined;
  }
  return dynamicIts[0];
}

function regexPattern() {
  return /((\S{0,2}describe?[^(]+)|(\s\S{0,2}it?[^(]+))\s*\(\s*((?:(?:\s*\+\s*)?((?<![\\])[`'"])(?:.(?!(?<![\\])\5))*.?\5)+)/gi;
}

function templateLiteralRegex() {
  // supports 5 levels of nested curly braces
  return /\$(?:{[^{}]*(?:{[^{}]*(?:{[^{}]*(?:{[^{}]*(?:{[^{}]*}[^{}]*)*[^{}]*}[^{}]*)*[^{}]*}[^{}]*)*[^{}]*}[^{}]*)*[^{}]*})/;
}

function removeEscapedQuotes(str) {
  return str.replace(/(?:\\|\\\\)((")|(')|(`))/g,"$1");
}

function removeComments(data) {
    return data.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '');
}

function removeMultilineDelimiters(str) {
    return str.replace(/^[`'"]|[`'"]$/g, '').replace(/[`'"]\s*\+\s*[`'"]/g, '')
}

function removeNewLines(data) {
    return data.replace(/\r?\n|\r/g, '');
}

function toDynamicNameRegExp(string) {
  var templateGlobalRegex = new RegExp(templateLiteralRegex().source, 'g');
  return new RegExp(string
      .replace(templateGlobalRegex, ".*")
      .replace(/[+?^${}()|[\]\\]|\.(?!\*)|(?<!\.)\*/g, '\\$&')); // escape special regexp characters
}

module.exports = {
    parseTestFiles: parseTestFiles,
    testFile: testFile
};

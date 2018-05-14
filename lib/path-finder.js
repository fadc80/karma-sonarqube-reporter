var fs = require('fs');
var glob = require('glob');

function parseTestFilePaths(pattern, encoding) {
    var paths = {}; 
    glob.sync(pattern).find((path, index, array) => {
        regexMatch(paths, path, encoding);
    });
    return paths;
}

function testFilePath(paths, describe, it) {
  return paths[describe] && 
         paths[describe][it] ?
         paths[describe][it] : 
         undefined; 
}

function regexMatch(paths, path, encoding) {
  var regex = regexPattern();
  var fileData = testFileData(path, encoding);
  var describe = undefined;
  var it = undefined;
  while ((result = regex.exec(fileData)) != null) {   
    type = result[2] || result[3];    
    text = result[5];
    switch(type) {
      case 'describe': { 
        describe = text;
        break;
      } 
      case 'it':
        it = text;
        paths[describe] = {};
        paths[describe][it] = path;
        break;
    }
  }
}

function regexPattern() {
  return new RegExp('((describe)|(it))\\s*\\(\\s*(\`|\'|\")(.*?)\\4,', 'gi');
}

function testFileData(path, encoding) {
    return removeNewLines(removeComments(fs.readFileSync(path, encoding)));
}

function removeComments(data) {
    return data.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '');
}

function removeNewLines(data) {
    return data.replace(/\r?\n|\r/g, '');
}

module.exports = {
    parseTestFilePaths: parseTestFilePaths,
    testFilePath: testFilePath 
};

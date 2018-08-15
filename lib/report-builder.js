// report-builder.ts
function createReport() {
    return {
      '@': {
        'version': '1'
      },
      'file': []
    };
  }

function createReportFile(path) {
  return {
    '@': {
      'path': path
    },
    'testCase': []
  };
}

function createReportTestCaseSuccess(result) {
  return createReportTestCase(result);
}

function createReportTestCaseSkipped(result) {
  var reportTestCase = createReportTestCase(result);
  reportTestCase['skipped'] = {
    '@': {
      'message': 'TestCase skipped'
    }
  };
  return reportTestCase;
}

function createReportTestCaseFailure(result, stacktrace) {
  var reportTestCase = createReportTestCase(result);
  reportTestCase['failure'] = {
    '@': {
      'message': 'TestCase failed'
    },
    '#': stacktrace
  };
  return reportTestCase;
}

function createReportTestCase(result) {
  return {
    "@": {
      "name": testCaseName(result),
      "duration": testCaseDuration(result)}
  };
}

function testCaseName(result) {
  return result.fullName !== undefined ? result.fullName :
    result.suite.concat(result.description).join('#');
}

function testCaseDuration(result) {
  return result.time;
}

module.exports = {
  createReport: createReport,
  createReportFile: createReportFile,
  createReportTestCaseSuccess: createReportTestCaseSuccess,
  createReportTestCaseSkipped: createReportTestCaseSkipped,
  createReportTestCaseFailure: createReportTestCaseFailure
};


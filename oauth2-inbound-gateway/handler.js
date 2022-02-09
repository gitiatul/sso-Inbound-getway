var { apiHelpers } = require("./src/helpers");

var smartOnFhir = require("./src/api/smartOnFhir");

/**
 * Default index function
 */
const index = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let statusCode = 200;
  let successData = {
    statusCode: statusCode,
    message: "KPI Ninja SSO SMART Inbound Gateway working.",
  };
  let html = apiHelpers.generateResponseHtml(null, successData, null);

  let headers = {
    "Content-Type": "text/html",
  };
  callback(null, apiHelpers.responseBuilder(headers, html, statusCode));
};

module.exports = {
  index: async (event, context, callback) => index(event, context, callback),
  /**
   * EHR SMART-on-FHIR launch endpoint
   */
  launch: async (event, context, callback) =>
    smartOnFhir.launch(event, context, callback),
  /**
   * EHR SMART-on-FHIR redirect endpoint
   */
  callback: async (event, context, callback) =>
    smartOnFhir.callback(event, context, callback),
};

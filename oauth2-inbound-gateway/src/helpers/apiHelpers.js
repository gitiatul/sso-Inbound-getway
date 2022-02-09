var ejs = require("ejs");
var fs = require("fs");
var path = require("path");

var helpers = require("./helpers");

var { kpiConfigs } = require("../config/index");

var apiHelpers = {
  /**
   * Generate response object
   * @param {string} headers Response header's object
   * @param {string} body Response body in string format
   * @param {number} statusCode HTTP Status code. Default is 200
   * @returns Response object
   */
  responseBuilder: (headers = null, body = null, statusCode = 200) => {
    let defaultHeaders = {
      "x-request-id": helpers.generateUniqueId(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };
    return {
      statusCode: statusCode,
      headers: headers != null ? headers : defaultHeaders,
      body: body,
    };
  },
  /**
   * Return error
   * @param {*} error Error object
   * @param {*} callback Callback reference
   */
  returnError: (error, callback) => {
    helpers.logError("Error: something went wrong.", error);
    if (error.name) {
      const message = `Invalid ${error.path}: ${error.value}`;
      callback(
        null,
        apiHelpers.responseBuilder(
          null,
          JSON.stringify({
            message: `Error:: ${message}`,
          }),
          400
        )
      );
    } else {
      callback(
        null,
        apiHelpers.responseBuilder(
          null,
          JSON.stringify({
            message: `Error:: ${error.name}`,
          }),
          error.statusCode || 500
        )
      );
    }
  },
  /**
   * Generate html template for ejs template engine
   * @param {object} pageMeta Page meta data object containing title, description, keywords
   * @param {object} successData Success data object
   * @param {object} errorData Error data object
   * @param {object} images Images object
   * @returns Rendered html template for ejs template engine
   */
  generateResponseHtml: (
    pageMeta = {
      title: "SSO SMART Inbound Gateway | KPI Ninja",
      description: "KPI Ninja SSO SMART Inbound Gateway",
      keywords: "KPI Ninja",
    },
    successData = null,
    errorData = null,
    images = { favicon: kpiConfigs.KPI_FAVICON, logo: kpiConfigs.KPI_LOGO }
  ) => {
    let templateName = "default.ejs";

    let pageData = {
      data: {
        page_meta: pageMeta,
        success: null,
        error: null,
        images: images,
      },
    };

    if (
      typeof errorData != "undefined" &&
      errorData != null &&
      errorData != ""
    ) {
      templateName = "error.ejs";
      pageData.data.error = errorData;
    }

    if (
      typeof successData != "undefined" &&
      successData != null &&
      successData != ""
    ) {
      templateName = "success.ejs";
      pageData.data.success = successData;
    }

    let generatedTemplate = fs.readFileSync(
      path.resolve(__dirname, "..", "views", "pages", templateName),
      "utf-8"
    );
    let html = ejs.render(generatedTemplate, pageData);

    return html;
  },
  parseApiErrorResponse: (err = null) => {
    let errData = {};
    errData.statusCode = 400;
    errData.data = null;

    if (
      typeof err == "undefined" ||
      err == null ||
      err == "" ||
      typeof err.response == "undefined" ||
      err.response == null ||
      err.response == ""
    ) {
      return errData;
    }

    if (
      typeof err.response.status != "undefined" &&
      err.response.status != null &&
      err.response.status != ""
    ) {
      errData.statusCode = err.response.status;
    }

    if (
      typeof err.response.data != "undefined" &&
      err.response.data != null &&
      err.response.data != ""
    ) {
      errData.data = err.response.data;
    }

    return errData;
  },
};

module.exports = apiHelpers;

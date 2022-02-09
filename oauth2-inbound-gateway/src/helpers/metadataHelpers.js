var { create } = require("xmlbuilder2");

var helpers = require("./helpers");

var metadataHelpers = {
  /**
   * Parse Metadata xml resource & extract authorize & token endpoints
   * @param {XMLDocument} metadataXml Metadata xml
   * @returns Object containing authorize & token endpoints
   */
  parseMetadataXml: (metadataXml = null) => {
    let rootElement = null;
    let response = {};
    response.status = false;
    response.data = {};
    response.data.authorize = null;
    response.data.token = null;
    response.error = {};
    response.error.message = null;

    let doc = create(metadataXml);
    let metadataJsonRoot = doc.end({ format: "object" });

    // For CapabilityStatement (STU3 or R4)
    if (typeof metadataJsonRoot.CapabilityStatement != "undefined") {
      rootElement = "CapabilityStatement";
    }

    // For Conformance (DSTU2)
    if (typeof metadataJsonRoot.Conformance != "undefined") {
      rootElement = "Conformance";
    }

    let metadataJson = metadataJsonRoot[rootElement];

    if (
      typeof metadataJson.rest == "undefined" ||
      metadataJson.rest == null ||
      metadataJson.rest == ""
    ) {
      response.error.message = "Invalid rest node.";
      return response;
    }
    let restElement = metadataJson.rest;

    if (
      typeof restElement.security == "undefined" ||
      restElement.security == null ||
      restElement.security == ""
    ) {
      response.error.message = "Invalid security node.";
      return response;
    }
    let securityElement = restElement.security;

    if (
      typeof securityElement.extension == "undefined" ||
      securityElement.extension == null ||
      securityElement.extension == ""
    ) {
      response.error.message = "Invalid extension node.";
      return response;
    }
    let extensionElement = securityElement.extension;

    if (
      typeof extensionElement.extension == "undefined" ||
      extensionElement.extension == null ||
      extensionElement.extension == "" ||
      extensionElement.extension.length <= 0
    ) {
      response.error.message = "Invalid extension array node.";
      return response;
    }
    let extensionArrElement = extensionElement.extension;

    let authObj = helpers.findArr(extensionArrElement, "@url", "authorize");
    if (typeof authObj == "undefined" || authObj == null || authObj == "") {
      response.error.message = "Authorize endpoint not found in metadata";
      return response;
    }
    if (
      typeof authObj.valueUri == "undefined" ||
      typeof authObj.valueUri["@value"] == "undefined"
    ) {
      response.error.message = "Invalid authorize endpoint in metadata";
      return response;
    }
    response.data.authorize = authObj.valueUri["@value"];

    let tknObj = helpers.findArr(extensionArrElement, "@url", "token");
    if (typeof tknObj == "undefined" || tknObj == null || tknObj == "") {
      response.error.message = "Token endpoint not found in metadata";
      return response;
    }
    if (
      typeof tknObj.valueUri == "undefined" ||
      typeof tknObj.valueUri["@value"] == "undefined"
    ) {
      response.error.message = "Invalid token endpoint in metadata";
      return response;
    }
    response.data.token = tknObj.valueUri["@value"];

    response.status = true;
    return response;
  },
  /**
   * Parse Metadata xml resource & extract authorize & token endpoints
   * @param {object} metadataJson Metadata json
   * @returns Object containing authorize & token endpoints
   */
  parseMetadataJson: (metadataJson = null) => {
    let response = {};
    response.status = false;
    response.data = {};
    response.data.authorize = null;
    response.data.token = null;
    response.error = {};
    response.error.message = null;

    if (
      typeof metadataJson.rest == "undefined" ||
      metadataJson.rest == null ||
      metadataJson.rest == ""
    ) {
      response.error.message = "Invalid rest node.";
      return response;
    }
    let restElement = metadataJson.rest;

    if (
      typeof restElement[0].security == "undefined" ||
      restElement[0].security == null ||
      restElement[0].security == ""
    ) {
      response.error.message = "Invalid security node.";
      return response;
    }
    let securityElement = restElement[0].security;

    if (
      typeof securityElement.extension == "undefined" ||
      securityElement.extension == null ||
      securityElement.extension == "" ||
      typeof securityElement.extension[0] == "undefined" ||
      securityElement.extension[0] == null ||
      securityElement.extension[0] == ""
    ) {
      response.error.message = "Invalid extension node.";
      return response;
    }
    let extensionElement = securityElement.extension[0];

    if (
      typeof extensionElement.extension == "undefined" ||
      extensionElement.extension == null ||
      extensionElement.extension == "" ||
      extensionElement.extension.length <= 0
    ) {
      response.error.message = "Invalid extension array node.";
      return response;
    }
    let extensionArrElement = extensionElement.extension;

    let authObj = helpers.findArr(extensionArrElement, "url", "authorize");
    if (typeof authObj == "undefined" || authObj == null || authObj == "") {
      response.error.message = "Authorize endpoint not found in metadata";
      return response;
    }
    if (
      typeof authObj.valueUri == "undefined" ||
      typeof authObj.valueUri == "undefined"
    ) {
      response.error.message = "Invalid authorize endpoint in metadata";
      return response;
    }
    response.data.authorize = authObj.valueUri;

    let tknObj = helpers.findArr(extensionArrElement, "url", "token");
    if (typeof tknObj == "undefined" || tknObj == null || tknObj == "") {
      response.error.message = "Token endpoint not found in metadata";
      return response;
    }
    if (
      typeof tknObj.valueUri == "undefined" ||
      typeof tknObj.valueUri == "undefined"
    ) {
      response.error.message = "Invalid token endpoint in metadata";
      return response;
    }
    response.data.token = tknObj.valueUri;

    response.status = true;
    return response;
  },
};

module.exports = metadataHelpers;

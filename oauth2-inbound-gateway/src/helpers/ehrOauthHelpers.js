var moment = require("moment");

var Models = require("../models");
var helpers = require("../helpers/helpers");
var encryptionHelpers = require("../helpers/encryptionHelpers");
var axios = require("../config/axios-config");

var oauthHelpers = {
  /**
   * Checks whether access token is valid or expired
   * @param {string} appTokenId App token id
   * @returns True if access token is valid, otherwise false
   */
  validateAccessToken: async (appTokenId = null) => {
    let validateTokenResponse = {};
    validateTokenResponse.status = 400;
    validateTokenResponse.valid = false;
    validateTokenResponse.error = null;

    if (
      typeof appTokenId == "undefined" ||
      appTokenId == "" ||
      appTokenId == null
    ) {
      validateTokenResponse.error = "Invalid app token id.";
      return validateTokenResponse;
    }

    let appDetails = await Models.AppDetails.findOne({
      where: { app_token_id: appTokenId },
    });

    if (
      typeof appDetails === "undefined" ||
      appDetails === null ||
      appDetails === ""
    ) {
      let errMsg = "App details not found";
      helpers.logError(errMsg);
      validateTokenResponse.error = errMsg;
      return validateTokenResponse;
    }

    let expiryDate =
      new Date(appDetails.access_token_expires_on).getTime() / 1000;
    let currentDate =
      new Date(moment(new Date()).format("YYYY-MM-DD HH:mm:ss")).getTime() /
      1000;

    if (currentDate >= expiryDate) {
      validateTokenResponse.valid = false;
      validateTokenResponse.error = "EHR access token expired.";
      return validateTokenResponse;
    }

    validateTokenResponse.status = 200;
    validateTokenResponse.valid = true;

    return validateTokenResponse;
  },
  /**
   * Renew EHR access token using refresh token
   * @param {string} appTokenId App token id
   * @returns Renews EHR access token, update it into database & returns updated access token
   */
  renewAccessToken: async (appTokenId = null) => {
    let tokenRenewalResponse = {};
    tokenRenewalResponse.status = 400;
    tokenRenewalResponse.token = null;
    tokenRenewalResponse.error = null;

    if (
      typeof appTokenId == "undefined" ||
      appTokenId == "" ||
      appTokenId == null
    ) {
      tokenRenewalResponse.error = "Invalid app token id.";
      return tokenRenewalResponse;
    }

    let appDetails = await Models.AppDetails.findOne({
      where: { app_token_id: appTokenId },
    });

    if (
      typeof appDetails === "undefined" ||
      appDetails === null ||
      appDetails === ""
    ) {
      let errMsg = "App details not found";
      helpers.logError(errMsg);
      tokenRenewalResponse.status = 404;
      tokenRenewalResponse.error = errMsg;
      return tokenRenewalResponse;
    }

    // Renew EHR access token using refresh token
    let grantType = "refresh_token";
    let accessApiPath = appDetails.token_endpoint;
    let clientId = appDetails.client_id;
    let clientSecret = appDetails.client_secret;
    let ehrAccessTokenResponse = null;

    let body =
      "grant_type=" + grantType + "&refresh_token=" + appDetails.refresh_token;

    let options = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    if (
      typeof clientSecret != "undefined" &&
      clientSecret != null &&
      clientSecret != ""
    ) {
      let authStr = clientId + ":" + clientSecret;

      let authBase64Encoded = encryptionHelpers.base64Encode(authStr);
      options.headers.Authorization = "Basic " + authBase64Encoded;
    }

    try {
      ehrAccessTokenResponse = await axios.post(accessApiPath, body, options);
    } catch (error) {
      let errMsg = error.response.statusText;
      helpers.logError(errMsg, error);
      tokenRenewalResponse.status = error.response.status;
      tokenRenewalResponse.error = errMsg;
      return tokenRenewalResponse;
    }

    if (ehrAccessTokenResponse == null) {
      tokenRenewalResponse.error =
        "Something went wrong while fetching ehr access token.|accessTokenResponse=null";
      return tokenRenewalResponse;
    }

    let { access_token: accessToken, expires_in: expiresIn } =
      ehrAccessTokenResponse.data;

    let appDetailsUpdateData = {
      access_token: accessToken,
      access_token_expires_on: moment(new Date())
        .add(parseInt(expiresIn, 10), "seconds")
        .format("YYYY-MM-DD HH:mm:ss"),
      updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    };
    let appDetailsUpdate = await appDetails.update(appDetailsUpdateData, {
      returning: true,
      plain: true,
    });
    helpers.logMessage(
      "EHR access token renewed & updated in ib_appdetails: id = " +
        appDetailsUpdate.id
    );

    tokenRenewalResponse.status = 200;
    tokenRenewalResponse.token = accessToken;

    return tokenRenewalResponse;
  },
  /**
   * Extract user attributes
   * @param {object} payload Data payload
   * @param {string} userAttrMappings User attribute's mappings
   * @returns User attributes
   */
  extractUserAttributes: (payload, userAttrMappings) => {
    let userAttrMappingsArr = userAttrMappings.split(",");

    let userAttrMappingJson = {};

    userAttrMappingsArr.forEach((entry) => {
      let dataArr = entry.split(":");
      if (dataArr[1] != null && dataArr[1] != "null" && dataArr[1] != "") {
        userAttrMappingJson[dataArr[0]] = dataArr[1];
      }
    });

    let providerUserName =
      typeof payload[userAttrMappingJson.username] != "undefined"
        ? payload[userAttrMappingJson.username]
        : null;
    let providerEmail =
      typeof payload[userAttrMappingJson.email] != "undefined"
        ? payload[userAttrMappingJson.email]
        : null;
    let providerFirstName =
      typeof payload[userAttrMappingJson.fname] != "undefined"
        ? payload[userAttrMappingJson.fname]
        : null;
    let providerLastName =
      typeof payload[userAttrMappingJson.lname] != "undefined"
        ? payload[userAttrMappingJson.lname]
        : null;
    let providerFhirId =
      typeof payload[userAttrMappingJson.user_fhir_id] != "undefined"
        ? payload[userAttrMappingJson.user_fhir_id]
        : null;
    let patientFhirId =
      typeof payload[userAttrMappingJson.patient_fhir_id] != "undefined"
        ? payload[userAttrMappingJson.patient_fhir_id]
        : null;
    let patientDob =
      typeof payload[userAttrMappingJson.patient_dob] != "undefined"
        ? payload[userAttrMappingJson.patient_dob]
        : null;
    let patientFirstName =
      typeof payload[userAttrMappingJson.patient_fname] != "undefined"
        ? payload[userAttrMappingJson.patient_fname]
        : null;
    let patientLastName =
      typeof payload[userAttrMappingJson.patient_lname] != "undefined"
        ? payload[userAttrMappingJson.patient_lname]
        : null;
    let patientGender =
      typeof payload[userAttrMappingJson.patient_gender] != "undefined"
        ? payload[userAttrMappingJson.patient_gender]
        : null;
    let patientMrn =
      typeof payload[userAttrMappingJson.patient_mrn] != "undefined"
        ? payload[userAttrMappingJson.patient_mrn]
        : null;

    let userAttr = {
      username: providerUserName,
      email: providerEmail,
      fname: providerFirstName,
      lname: providerLastName,
      user_fhir_id: providerFhirId,
      patient_fhir_id: patientFhirId,
      patient_dob: patientDob,
      patient_fname: patientFirstName,
      patient_lname: patientLastName,
      patient_gender: patientGender,
      patient_mrn: patientMrn,
    };

    return userAttr;
  },
};

module.exports = oauthHelpers;

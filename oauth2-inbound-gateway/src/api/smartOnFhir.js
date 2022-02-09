var moment = require("moment");

var {
  apiHelpers,
  encryptionHelpers,
  helpers,
  metadataHelpers,
  patientHelpers,
  practitionerHelpers,
  ehrOauthHelpers,
} = require("../helpers");
var { axios, kpiConfigs } = require("../config/index");
var Models = require("../models");

var dummyData = require("../config/dummyData"); // FIXME hard-coded for testing

/**
 * EHR SMART-on-FHIR launch endpoint
 * /launch?apptoken=<PARAMETER>&iss=<PARAMETER>&launch=<PARAMETER>
 */
const smartLaunch = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (
    typeof event.queryStringParameters == "undefined" ||
    event.queryStringParameters == null ||
    event.queryStringParameters == "" ||
    typeof event.queryStringParameters.apptoken == "undefined" ||
    event.queryStringParameters.apptoken == null ||
    event.queryStringParameters.apptoken == "" ||
    typeof event.queryStringParameters.iss == "undefined" ||
    event.queryStringParameters.iss == null ||
    event.queryStringParameters.iss == "" ||
    typeof event.queryStringParameters.launch == "undefined" ||
    event.queryStringParameters.launch == null ||
    event.queryStringParameters.launch == ""
  ) {
    let statusCode = 422;
    let errorData = {
      statusCode: statusCode,
      message: "Invalid request. apptoken, iss, launch are required.",
      code: "INVALID_REQUEST",
    };
    let html = apiHelpers.generateResponseHtml(null, null, errorData);

    let headers = {
      "x-request-id": helpers.generateUniqueId(),
      "Content-Type": "text/html",
    };
    callback(null, apiHelpers.responseBuilder(headers, html, statusCode));
  }

  let {
    apptoken: appToken,
    iss: issuerUri,
    launch,
  } = event.queryStringParameters;

  // Sanitize appToken. Remove trailing '?' symbols.
  appToken = appToken.replace(/[?]/g, "");

  // Obtain access token from kpi using /api/login
  let accessTokenResponse = null;
  let accessToken = null;

  let accessTokenApiPath = kpiConfigs.API.INBOUND_API_LOGIN_URI;

  let body = {
    username: kpiConfigs.API.INBOUND_ADMIN_USERNAME,
    password: kpiConfigs.API.INBOUND_ADMIN_PASSWORD,
  };

  try {
    accessTokenResponse = await axios.post(accessTokenApiPath, body);
  } catch (err1) {
    let errData = apiHelpers.parseApiErrorResponse(err1);
    let errMsg = "Something went wrong while getting app access token.";
    if (
      errData.data != null &&
      typeof errData.data.message != "undefined" &&
      errData.data.message != null &&
      errData.data.message != ""
    ) {
      errMsg = errMsg + " " + errData.data.message;
    }
    helpers.logError(errMsg, err1);
    let statusCode = err1.response.status;
    let errorData = {
      statusCode: statusCode,
      message: errMsg,
      code: "API_ACCESS_TOKEN_ERROR",
    };
    let html = apiHelpers.generateResponseHtml(null, null, errorData);

    let headers = {
      "x-request-id": helpers.generateUniqueId(),
      "Content-Type": "text/html",
    };

    callback(null, apiHelpers.responseBuilder(headers, html, statusCode));
    return;
  }

  if (accessTokenResponse == null) {
    let errMsg = "Something went wrong while fetching kpi access token.";
    helpers.logError(errMsg + " accessTokenResponse is null");
    let statusCode = 400;
    let errorData = {
      statusCode: statusCode,
      message: errMsg,
      code: "KPI_ACCESS_TOKEN_ERROR",
    };
    let html = apiHelpers.generateResponseHtml(null, null, errorData);

    let headers1 = {
      "x-request-id": helpers.generateUniqueId(),
      "Content-Type": "text/html",
    };

    callback(null, apiHelpers.responseBuilder(headers1, html, statusCode));
    return;
  }

  accessToken = accessTokenResponse.data.results.accessToken;

  // Validate apptoken using /sso/inbound/detail
  let appDetailsResponse = null;
  let appDetails = null;

  let appDetailsApiPath = kpiConfigs.API.INBOUND_APP_DETAIL_URI;

  let headers = {
    Authorization: accessToken,
  };

  let params = {
    apptoken: appToken,
  };

  let options = {
    headers: headers,
    params: params,
  };

  try {
    appDetailsResponse = await axios.get(appDetailsApiPath, options);
  } catch (err2) {
    let errData = apiHelpers.parseApiErrorResponse(err2);
    let errMsg = "Something went wrong while fetching kpi app details.";
    if (
      errData.data != null &&
      typeof errData.data.message != "undefined" &&
      errData.data.message != null &&
      errData.data.message != ""
    ) {
      errMsg = errMsg + " " + errData.data.message;
    }
    helpers.logError(errMsg, err2);
    let statusCode = err2.response.status;
    let errorData = {
      statusCode: statusCode,
      message: errMsg,
      code: "KPI_APP_DETAILS_ERROR",
    };
    let html = apiHelpers.generateResponseHtml(null, null, errorData);

    let headers2 = {
      "x-request-id": helpers.generateUniqueId(),
      "Content-Type": "text/html",
    };

    callback(null, apiHelpers.responseBuilder(headers2, html, statusCode));
    return;
  }

  if (appDetailsResponse == null) {
    let errMsg = "Something went wrong while fetching kpi app details";
    helpers.logError(errMsg + "appDetailsResponse is null");
    let statusCode = 400;
    let errorData = {
      statusCode: statusCode,
      message: errMsg,
      code: "KPI_APP_DETAILS_ERROR",
    };
    let html = apiHelpers.generateResponseHtml(null, null, errorData);

    let headers1 = {
      "x-request-id": helpers.generateUniqueId(),
      "Content-Type": "text/html",
    };

    callback(null, apiHelpers.responseBuilder(headers1, html, statusCode));
    return;
  }

  appDetails = appDetailsResponse.data;

  let authorizeEndpoint = null;
  let tokenEndpoint = null;
  let rootCompaniesId = appDetails.results.rootCompanies;
  let audienceURL = null;
  if (
    typeof appDetails.results.audienceURL != "undefined" &&
    appDetails.results.audienceURL != null &&
    appDetails.results.audienceURL != "null" &&
    appDetails.results.audienceURL != ""
  ) {
    audienceURL = appDetails.results.audienceURL;
  } else if (
    typeof issuerUri != "undefined" &&
    issuerUri != null &&
    issuerUri != "null" &&
    issuerUri != "" &&
    issuerUri != kpiConfigs.PRESHARED_KEY
  ) {
    audienceURL = issuerUri;
  }

  let issPreshared = issuerUri == kpiConfigs.PRESHARED_KEY;
  let clientId = appDetails.results.clientId;
  let clientSecret = appDetails.results.clientSecret;
  let clientSecretType = appDetails.results.clientSecretType;
  let userAttrLocation = appDetails.results.userAttrLocation;
  let userAttrMappings = appDetails.results.userAttrMappings;
  let appTokenId = helpers.generateUniqueId();
  let scope = encodeURIComponent(appDetails.results.ehrScope);

  let dummyCreds = dummyData[appToken]; // FIXME hard-coded for testing
  userAttrLocation = dummyCreds.USER_ATTRIBUTES_LOCATION; // FIXME hard-coded for testing
  userAttrMappings = dummyCreds.USER_ATTRIBUTES_MAPPINGS; // FIXME hard-coded for testing

  let metadataMIMEType =
    typeof kpiConfigs.ehrMetadata[appDetails.results.metadataMIMEType] !=
      "undefined" &&
    kpiConfigs.ehrMetadata[appDetails.results.metadataMIMEType] != null &&
    kpiConfigs.ehrMetadata[appDetails.results.metadataMIMEType] != "null" &&
    kpiConfigs.ehrMetadata[appDetails.results.metadataMIMEType] != ""
      ? kpiConfigs.ehrMetadata[appDetails.results.metadataMIMEType]
      : "application/json";

  // if issPreshared is true, use authorize & token endpoints from above api response
  if (issPreshared == true) {
    // use authorize & token endpoints from above api response
    authorizeEndpoint = appDetails.results.authorizationURL;
    tokenEndpoint = appDetails.results.tokenValidatorURL;
  }

  // if issPreshared is not true, use metadata to obtain authorize & token endpoints
  if (issPreshared != true) {
    // use metadata to obtain authorize & token endpoints
    let metadataResponse = null;

    let metadataUri = issuerUri + "/metadata";
    let metadataHeaders = {
      Accept: metadataMIMEType,
    };

    let metadataOptions = {
      headers: metadataHeaders,
    };

    try {
      metadataResponse = await axios.get(metadataUri, metadataOptions);
    } catch (error) {
      let errMsg = "Something went wrong while fetching metadata details.";
      helpers.logError(errMsg, error);
      let statusCode = error.response.status;
      let errorData = {
        statusCode: statusCode,
        message: errMsg,
        code: "EHR_METADATA_ERROR",
      };
      let html = apiHelpers.generateResponseHtml(null, null, errorData);

      let headers3 = {
        "x-request-id": helpers.generateUniqueId(),
        "Content-Type": "text/html",
      };

      callback(null, apiHelpers.responseBuilder(headers3, html, statusCode));
      return;
    }

    if (metadataResponse == null) {
      let errMsg = "Something went wrong while fetching metadata details";
      helpers.logError(errMsg + " metadataResponse is null");
      let statusCode = 400;
      let errorData = {
        statusCode: statusCode,
        message: errMsg,
        code: "EHR_METADATA_ERROR",
      };
      let html = apiHelpers.generateResponseHtml(null, null, errorData);

      let headers1 = {
        "x-request-id": helpers.generateUniqueId(),
        "Content-Type": "text/html",
      };

      callback(null, apiHelpers.responseBuilder(headers1, html, statusCode));
      return;
    }

    let oauthEndpoints = null;

    if (metadataMIMEType.includes("xml")) {
      oauthEndpoints = await metadataHelpers.parseMetadataXml(
        metadataResponse.data
      );
    }

    if (!metadataMIMEType.includes("xml")) {
      oauthEndpoints = await metadataHelpers.parseMetadataJson(
        metadataResponse.data
      );
    }

    if (oauthEndpoints == null) {
      let errMsg = "Something went wrong while parsing metadata response";
      helpers.logError(errMsg + " oauthEndpoints is null");
      let statusCode = 400;
      let errorData = {
        statusCode: statusCode,
        message: errMsg,
        code: "EHR_METADATA_PARSE_ERROR",
      };
      let html = apiHelpers.generateResponseHtml(null, null, errorData);

      let headers1 = {
        "x-request-id": helpers.generateUniqueId(),
        "Content-Type": "text/html",
      };

      callback(null, apiHelpers.responseBuilder(headers1, html, statusCode));
      return;
    }

    if (oauthEndpoints.status != true) {
      helpers.logError(oauthEndpoints.error);
      let statusCode = 400;
      let errorData = {
        statusCode: statusCode,
        message: oauthEndpoints.error.message,
        code: "EHR_METADATA_PARSE_ERROR",
      };
      let html = apiHelpers.generateResponseHtml(null, null, errorData);

      let headers1 = {
        "x-request-id": helpers.generateUniqueId(),
        "Content-Type": "text/html",
      };

      callback(null, apiHelpers.responseBuilder(headers1, html, statusCode));
      return;
    }

    authorizeEndpoint = oauthEndpoints.data.authorize;
    tokenEndpoint = oauthEndpoints.data.token;
  }

  // Create launch entry in database
  let dataForAppDetails = {
    id: null,
    app_token_id: appTokenId,
    app_token: appToken,
    kpi_access_token: accessToken,
    is_preshared: issPreshared,
    root_companies_id: rootCompaniesId,
    client_id: clientId,
    client_secret: clientSecret,
    client_secret_type: clientSecretType,
    iss: issuerUri,
    authorization_endpoint: authorizeEndpoint,
    token_endpoint: tokenEndpoint,
    audience_endpoint: audienceURL,
    scope: scope,
    patient_fhir_id: null,
    access_token: null,
    access_token_expires_on: null,
    refresh_token: null,
    id_token: null,
    user_attr_location: userAttrLocation,
    user_attr_mappings: userAttrMappings,
    created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    updated_at: null,
  };

  let createAppDetails = null;

  try {
    createAppDetails = await Models.AppDetails.create(dataForAppDetails);
  } catch (dbErr1) {
    let errMsg =
      "Error while creating entry in database for app details after launch.";
    helpers.logError(errMsg, dbErr1);
    let statusCode = 400;
    let errorData = {
      statusCode: statusCode,
      message: errMsg,
      code: "DB_ERROR",
    };
    let html = apiHelpers.generateResponseHtml(null, null, errorData);

    let headers1 = {
      "x-request-id": helpers.generateUniqueId(),
      "Content-Type": "text/html",
    };
    callback(null, apiHelpers.responseBuilder(headers1, html, statusCode));
    return;
  }

  if (createAppDetails == null) {
    let errMsg =
      "Error while creating entry in database for app details after launch.";
    helpers.logError(errMsg + " createAppDetails is null");
    let statusCode = 400;
    let errorData = {
      statusCode: statusCode,
      message: errMsg,
      code: "DB_ERROR",
    };
    let html = apiHelpers.generateResponseHtml(null, null, errorData);

    let headers1 = {
      "x-request-id": helpers.generateUniqueId(),
      "Content-Type": "text/html",
    };

    callback(null, apiHelpers.responseBuilder(headers1, html, statusCode));
    return;
  }

  helpers.logMessage(
    "Entry created in ib_appdetails: id = " + createAppDetails.id
  );

  // Continue SMART-on-FHIR oauth2 flow
  let redirectUri = process.env.GATEWAY_URL + `/callback`;
  let state = createAppDetails.app_token_id;

  let redirectTo =
    authorizeEndpoint +
    "?scope=" +
    scope +
    "&response_type=code" +
    "&redirect_uri=" +
    redirectUri +
    "&client_id=" +
    clientId +
    "&state=" +
    state;

  if (launch !== kpiConfigs.PRESHARED_KEY) {
    redirectTo = redirectTo + "&launch=" + launch;
  }

  if (
    typeof audienceURL != "undefined" &&
    audienceURL != null &&
    audienceURL != "null" &&
    audienceURL != ""
  ) {
    redirectTo = redirectTo + "&aud=" + decodeURIComponent(audienceURL);
  }

  let redirectHeaders = {
    "x-request-id": helpers.generateUniqueId(),
    Location: redirectTo,
  };
  return callback(null, apiHelpers.responseBuilder(redirectHeaders, null, 307));
};

/**
 * EHR SMART-on-FHIR redirect endpoint
 * /callback?code=<PARAMETER>&state=<PARAMETER>
 */
const smartCallback = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (
    typeof event.queryStringParameters == "undefined" ||
    event.queryStringParameters == null ||
    event.queryStringParameters == ""
  ) {
    let statusCode = 422;
    let errorData = {
      statusCode: statusCode,
      message: "code, state is required.",
      code: "INVALID_REQUEST",
    };
    let html = apiHelpers.generateResponseHtml(null, null, errorData);

    let headers = {
      "x-request-id": helpers.generateUniqueId(),
      "Content-Type": "text/html",
    };
    callback(null, apiHelpers.responseBuilder(headers, html, statusCode));
  }

  let {
    error: callbackErr,
    error_uri: callbackErrUri,
    error_description: callbackErrDesc,
    code,
    state: accessTokenState,
  } = event.queryStringParameters;

  if (
    typeof callbackErr != "undefined" &&
    callbackErr != null &&
    callbackErr != ""
  ) {
    let statusCode = 400;
    let errorData = {
      statusCode: statusCode,
      message: callbackErrDesc,
      code: callbackErr,
      url: callbackErrUri,
    };
    let html = apiHelpers.generateResponseHtml(null, null, errorData);

    let headers = {
      "x-request-id": helpers.generateUniqueId(),
      "Content-Type": "text/html",
    };
    callback(null, apiHelpers.responseBuilder(headers, html, statusCode));
  }

  if (
    typeof code == "undefined" ||
    code == null ||
    code == "" ||
    typeof accessTokenState == "undefined" ||
    accessTokenState == null ||
    accessTokenState == ""
  ) {
    let statusCode = 422;
    let errorData = {
      statusCode: statusCode,
      message: "code, state is required.",
      code: "INVALID_REQUEST",
    };
    let html = apiHelpers.generateResponseHtml(null, null, errorData);

    let headers = {
      "x-request-id": helpers.generateUniqueId(),
      "Content-Type": "text/html",
    };
    callback(null, apiHelpers.responseBuilder(headers, html, statusCode));
  }

  let grantType = "authorization_code";
  let ehrAccessTokenResponse = null;

  // Find launch entry in database using state
  let appTokenId = accessTokenState;
  let appDetails = null;

  try {
    appDetails = await Models.AppDetails.findOne({
      where: { app_token_id: appTokenId },
    });
  } catch (dbErr2) {
    let errMsg = "Error while getting app details from database after callback";
    helpers.logError(errMsg, dbErr2);
    let statusCode = 400;
    let errorData = {
      statusCode: statusCode,
      message: errMsg,
      code: "DB_ERROR",
    };
    let html = apiHelpers.generateResponseHtml(null, null, errorData);

    let headers1 = {
      "x-request-id": helpers.generateUniqueId(),
      "Content-Type": "text/html",
    };
    callback(null, apiHelpers.responseBuilder(headers1, html, statusCode));
    return;
  }

  if (
    typeof appDetails === "undefined" ||
    appDetails === null ||
    appDetails === ""
  ) {
    let errMsg = "App details not found after launch.";
    helpers.logError(errMsg + " appDetails is " + appDetails);
    let statusCode = 404;
    let errorData = {
      statusCode: statusCode,
      message: errMsg,
      code: "INVALID_APP_DETAILS",
    };
    let html = apiHelpers.generateResponseHtml(null, null, errorData);

    let headers = {
      "x-request-id": helpers.generateUniqueId(),
      "Content-Type": "text/html",
    };
    callback(null, apiHelpers.responseBuilder(headers, html, statusCode));
  }

  // Obtain access token from ehr
  let accessApiPath = appDetails.token_endpoint;
  let clientId = appDetails.client_id;
  let clientSecret = appDetails.client_secret;
  let clientSecretType = appDetails.client_secret_type;
  let redirectUri = process.env.GATEWAY_URL + "/callback";

  let body =
    "grant_type=" +
    grantType +
    "&code=" +
    code +
    "&redirect_uri=" +
    redirectUri;

  let options = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  if (
    typeof clientSecret == "undefined" ||
    clientSecret == null ||
    clientSecret == "null" ||
    clientSecret == ""
  ) {
    body = body + "&client_id=" + clientId;
  }

  if (
    typeof clientSecret != "undefined" &&
    clientSecret != null &&
    clientSecret != "null" &&
    clientSecret != ""
  ) {
    switch (clientSecretType) {
      case kpiConfigs.clientSecretTypes.BODY:
        body =
          body + "&client_id=" + clientId + "&client_secret=" + clientSecret;
        break;

      default:
        options.headers.Authorization =
          "Basic " +
          encryptionHelpers.base64Encode(clientId + ":" + clientSecret);
        break;
    }
  }

  try {
    ehrAccessTokenResponse = await axios.post(accessApiPath, body, options);
  } catch (error) {
    let errMsg = "Something went wrong while fetching ehr access token.";
    helpers.logError(errMsg, error);
    let statusCode = error.response.status;
    let errorData = {
      statusCode: statusCode,
      message: errMsg,
      code: "EHR_ACCESS_TOKEN_ERROR",
    };
    let html = apiHelpers.generateResponseHtml(null, null, errorData);

    let headers3 = {
      "x-request-id": helpers.generateUniqueId(),
      "Content-Type": "text/html",
    };

    callback(null, apiHelpers.responseBuilder(headers3, html, statusCode));
  }

  if (ehrAccessTokenResponse == null) {
    let errMsg = "Something went wrong while fetching ehr access token";
    helpers.logError(errMsg + "ehrAccessTokenResponse is null");
    let statusCode = 400;
    let errorData = {
      statusCode: statusCode,
      message: errMsg,
      code: "EHR_ACCESS_TOKEN_ERROR",
    };
    let html = apiHelpers.generateResponseHtml(null, null, errorData);

    let headers1 = {
      "x-request-id": helpers.generateUniqueId(),
      "Content-Type": "text/html",
    };

    callback(null, apiHelpers.responseBuilder(headers1, html, statusCode));
    return;
  }

  console.log(
    "\n----------------\naccess_token response: ",
    ehrAccessTokenResponse.data,
    "\n----------------\n"
  ); // REMOVE console

  let {
    access_token: accessToken,
    expires_in: expiresIn,
    refresh_token: refreshToken,
    id_token: idToken,
  } = ehrAccessTokenResponse.data;

  // Get user attribute location
  let userAttrLocation = appDetails.user_attr_location;

  let decodedToken = null;

  switch (userAttrLocation) {
    case kpiConfigs.userAttributesLocation.ID_TOKEN:
      decodedToken = helpers.jwtTokenDecode(idToken);
      break;

    case kpiConfigs.userAttributesLocation.ACCESS_TOKEN:
      decodedToken = helpers.jwtTokenDecode(accessToken);
      break;

    default:
      decodedToken = {
        token: null,
        error: false,
        data: ehrAccessTokenResponse.data,
      };
      break;
  }

  if (decodedToken.error != false && decodedToken.data === false) {
    let errMsg = "Error while decoding token.";
    helpers.logError(errMsg, decodedToken);
    let statusCode = 400;
    let errorData = {
      statusCode: statusCode,
      message: errMsg,
      code: "TOKEN_DECODE_ERROR",
    };
    let html = apiHelpers.generateResponseHtml(null, null, errorData);

    let headers = {
      "x-request-id": helpers.generateUniqueId(),
      "Content-Type": "text/html",
    };

    callback(null, apiHelpers.responseBuilder(headers, html, statusCode));
    return;
  }

  let userAttrMappings = appDetails.user_attr_mappings;
  // Extract user attributes
  let userAttributes = ehrOauthHelpers.extractUserAttributes(
    decodedToken.data,
    userAttrMappings
  );

  let providerFhirId = userAttributes.user_fhir_id;
  let providerUserName = userAttributes.username;
  let providerFirstName = userAttributes.fname;
  let providerEmail = userAttributes.email;
  let providerLastName = userAttributes.lname;
  let patientFhirId = userAttributes.patient_fhir_id;
  let patientDob = userAttributes.patient_dob;
  let patientFirstName = userAttributes.patient_fname;
  let patientLastName = userAttributes.patient_lname;
  let patientGender = userAttributes.patient_gender;
  let patientMrn = userAttributes.patient_mrn;

  // Update access token & refresh token in database
  if (accessTokenState !== appDetails.app_token_id) {
    let errMsg = "state do not match with launch";
    helpers.logError(
      errMsg +
        " accessTokenState: " +
        accessTokenState +
        " & appDetails.app_token_id: " +
        appDetails.app_token_id
    );
    let statusCode = 400;
    let errorData = {
      statusCode: statusCode,
      message: errMsg,
      code: "EHR_ACCESS_TOKEN_ERROR",
    };
    let html = apiHelpers.generateResponseHtml(null, null, errorData);

    let headers1 = {
      "x-request-id": helpers.generateUniqueId(),
      "Content-Type": "text/html",
    };

    callback(null, apiHelpers.responseBuilder(headers1, html, statusCode));
    return;
  }

  let appDetailsUpdateData = {
    provider_fhir_id: providerFhirId,
    patient_fhir_id: patientFhirId,
    access_token: accessToken,
    access_token_expires_on: moment(new Date())
      .add(parseInt(expiresIn, 10), "seconds")
      .format("YYYY-MM-DD HH:mm:ss"),
    refresh_token: refreshToken,
    id_token: idToken,
    updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  };
  let appDetailsUpdate = await appDetails.update(appDetailsUpdateData, {
    returning: true,
    plain: true,
  });
  helpers.logMessage(
    "App details updated in ib_appdetails: id = " + appDetailsUpdate.id
  );

  let issPreshared = appDetails.is_preshared;

  let appLoginDetails = null;

  let appLoginApiPath = kpiConfigs.API.INBOUND_APP_LOGIN_URI;

  let headers2 = {};
  headers2.Authorization = appDetails.kpi_access_token;

  let options2 = {
    headers: headers2,
  };

  let contextData = [];
  let appLoginData = {};

  if (issPreshared == 1) {
    // Check if patient context is passed
    if (
      typeof patientMrn != "undefined" &&
      patientMrn != null &&
      patientMrn != ""
    ) {
      let patientData = {};
      patientData.patientFirstName = patientFirstName;
      patientData.patientLastName = patientLastName;
      patientData.patientGender = patientGender;
      patientData.patientDob = patientDob;
      patientData.patientMrn = patientMrn;
      contextData = await patientHelpers.generatePatientPayload(
        appDetails.app_token_id,
        patientData
      );
    }

    appLoginData = {
      apptoken: appDetails.app_token,
      username:
        typeof providerUserName != "undefined" ? providerUserName : null,
      email: typeof providerEmail != "undefined" ? providerEmail : null,
      fname: typeof providerFirstName != "undefined" ? providerFirstName : null,
      lname: typeof providerLastName != "undefined" ? providerLastName : null,
      context: contextData,
    };
  }

  if (issPreshared != 1) {
    // Get provider data using Practitioner.Read (R4) FHIR Resource
    if (
      typeof providerFhirId == "undefined" ||
      providerFhirId == "" ||
      providerFhirId == null
    ) {
      let errMsg = "Invalid provider fhir id";
      helpers.logError(errMsg + " providerFhirId: " + providerFhirId);
      let statusCode = 400;
      let errorData = {
        statusCode: statusCode,
        message: errMsg,
        code: "INVALID_PROVIDER_FHIR_ID",
      };
      let html = apiHelpers.generateResponseHtml(null, null, errorData);

      let headers1 = {
        "x-request-id": helpers.generateUniqueId(),
        "Content-Type": "text/html",
      };

      callback(null, apiHelpers.responseBuilder(headers1, html, statusCode));
      return;
    }

    let practitionerDataResource = null;
    let fhirApiBasePath = appDetails.iss;

    try {
      practitionerDataResource = await practitionerHelpers.getPractitioner(
        fhirApiBasePath,
        accessToken,
        providerFhirId
      );
    } catch (practitionerFhirErr) {
      let errMsg = "Practitioner details finding failed.";
      if (
        typeof practitionerFhirErr.response != "undefined" &&
        typeof practitionerFhirErr.response.data != "undefined" &&
        typeof practitionerFhirErr.response.data.error != "undefined" &&
        practitionerFhirErr.response.data.error.name == "Error"
      ) {
        errMsg = practitionerFhirErr.response.data.error.message;
      }
      helpers.logError(errMsg, practitionerFhirErr);
      let statusCode = practitionerFhirErr.response.status;
      let errorData = {
        statusCode: statusCode,
        message: errMsg,
        code: "PRACTITIONER_DATA_ERROR",
      };
      let html = apiHelpers.generateResponseHtml(null, null, errorData);

      let headers3 = {
        "x-request-id": helpers.generateUniqueId(),
        "Content-Type": "text/html",
      };

      callback(null, apiHelpers.responseBuilder(headers3, html, statusCode));
      return;
    }

    if (practitionerDataResource == null) {
      let errMsg = "Fetching practitioner data failed";
      helpers.logError(errMsg + " practitionerDataResource is null");
      let statusCode = 400;
      let errorData = {
        statusCode: statusCode,
        message: errMsg,
        code: "PRACTITIONER_DATA_ERROR",
      };
      let html = apiHelpers.generateResponseHtml(null, null, errorData);

      let headers1 = {
        "x-request-id": helpers.generateUniqueId(),
        "Content-Type": "text/html",
      };

      callback(null, apiHelpers.responseBuilder(headers1, html, statusCode));
      return;
    }

    let practitionerData = practitionerHelpers.extractPractitionerData(
      practitionerDataResource.data
    );

    // Check if patient context is passed
    if (
      typeof patientFhirId != "undefined" &&
      patientFhirId != null &&
      patientFhirId != ""
    ) {
      // Make Patient.Read (R4) call
      let patientDataResponse = null;

      let patientApiPath = appDetails.iss + "/Patient/" + patientFhirId;

      let headers = {};
      if (accessToken.startsWith("Bearer ") == true) {
        headers.Authorization = accessToken;
      }
      if (accessToken.startsWith("Bearer ") != true) {
        headers.Authorization = "Bearer " + accessToken;
      }

      let options1 = {
        headers: headers,
      };

      try {
        patientDataResponse = await axios.get(patientApiPath, options1);
      } catch (patientFhirErr) {
        let errMsg = "Something went wrong while fetching patient fhir data.";
        if (
          typeof patientFhirErr.response != "undefined" &&
          typeof patientFhirErr.response.data != "undefined" &&
          typeof patientFhirErr.response.data.error != "undefined" &&
          patientFhirErr.response.data.error.name == "Error"
        ) {
          errMsg = patientFhirErr.response.data.error.message;
        }
        helpers.logError(errMsg, patientFhirErr);
        let statusCode = patientFhirErr.response.status;
        let errorData = {
          statusCode: statusCode,
          message: errMsg,
          code: "PATIENT_DATA_ERROR",
        };
        let html = apiHelpers.generateResponseHtml(null, null, errorData);

        let headers3 = {
          "x-request-id": helpers.generateUniqueId(),
          "Content-Type": "text/html",
        };

        callback(null, apiHelpers.responseBuilder(headers3, html, statusCode));
        return;
      }

      if (patientDataResponse == null) {
        let errMsg = "Something went wrong while fetching patient fhir data";
        helpers.logError(errMsg + " patientDataResponse is null");
        let statusCode = 400;
        let errorData = {
          statusCode: statusCode,
          message: errMsg,
          code: "PATIENT_DATA_ERROR",
        };
        let html = apiHelpers.generateResponseHtml(null, null, errorData);

        let headers1 = {
          "x-request-id": helpers.generateUniqueId(),
          "Content-Type": "text/html",
        };

        callback(null, apiHelpers.responseBuilder(headers1, html, statusCode));
        return;
      }

      let patientDetails = patientHelpers.extractPatientData(
        patientDataResponse.data
      );

      contextData = await patientHelpers.generatePatientPayload(
        appDetails.app_token_id,
        patientDetails
      );
    }

    appLoginData = {
      apptoken: appDetails.app_token,
      username: practitionerData.username,
      email: practitionerData.email,
      fname: practitionerData.first,
      lname: practitionerData.last,
      context: contextData,
    };
  }

  try {
    appLoginDetails = await axios.post(appLoginApiPath, appLoginData, options2);
  } catch (appLoginErr) {
    let errData = apiHelpers.parseApiErrorResponse(appLoginErr);
    let errMsg = "App login failed.";
    if (
      errData.data != null &&
      typeof errData.data.message != "undefined" &&
      errData.data.message != null &&
      errData.data.message != ""
    ) {
      errMsg = errMsg + " " + errData.data.message;
    }
    helpers.logError(errMsg, appLoginErr);
    let statusCode = appLoginErr.response.status;
    let errorData = {
      statusCode: statusCode,
      message: errMsg,
      code: "KPI_APP_LOGIN_ERROR",
    };
    let html = apiHelpers.generateResponseHtml(null, null, errorData);

    let headers3 = {
      "x-request-id": helpers.generateUniqueId(),
      "Content-Type": "text/html",
    };

    callback(null, apiHelpers.responseBuilder(headers3, html, statusCode));
    return;
  }

  if (appLoginDetails == null) {
    let errMsg = "Something went wrong while fetching app login details";
    helpers.logError(errMsg + " appLoginDetails is null");
    let statusCode = 400;
    let errorData = {
      statusCode: statusCode,
      message: errMsg,
      code: "KPI_APP_LOGIN_ERROR",
    };
    let html = apiHelpers.generateResponseHtml(null, null, errorData);

    let headers1 = {
      "x-request-id": helpers.generateUniqueId(),
      "Content-Type": "text/html",
    };

    callback(null, apiHelpers.responseBuilder(headers1, html, statusCode));
    return;
  }

  let appLandingUri = appLoginDetails.data.results.landingURL;

  let redirectHeaders = {
    "x-request-id": helpers.generateUniqueId(),
    Location: appLandingUri,
  };
  return callback(null, apiHelpers.responseBuilder(redirectHeaders, null, 303));
};

module.exports = {
  /**
   * EHR SMART-on-FHIR launch endpoint
   */
  launch: async (event, context, callback) =>
    smartLaunch(event, context, callback),
  /**
   * EHR SMART-on-FHIR redirect endpoint
   */
  callback: async (event, context, callback) =>
    smartCallback(event, context, callback),
};

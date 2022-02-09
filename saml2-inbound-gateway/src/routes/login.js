var express = require("express");
var router = express.Router();
var passport = require("passport");
var SamlStrategy = require("passport-saml").Strategy;
var moment = require("moment");

var {
    responseHelpers,
    commonHelpers,
    logHelpers,
    samlHelpers,
} = require("../helpers");
var { axios } = require("../config");
var Models = require("../models");

router.get("/saml", async (req, res) => {
    let { apptoken: appToken } = req.query;
    if (typeof appToken == "undefined" || appToken == null || appToken == "") {
        let errMsg = "apptoken is required.";
        logHelpers.logError(errMsg + " appToken is " + appToken);
        let statusCode = 400;
        let errorData = {
            statusCode: statusCode,
            message: errMsg,
            code: "INVALID_REQUEST",
        };
        return responseHelpers.generateResponseHtml(res, null, errorData, null);
    }

    // Sanitize appToken. Remove trailing '?' symbols.
    appToken = appToken.replace(/[?]/g, "");

    // Obtain access token from kpi using /api/login
    let accessTokenResponse = null;
    let accessToken = null;

    let accessTokenApiPath = process.env.API_LOGIN_ENDPOINT;

    let body = {
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
    };

    try {
        accessTokenResponse = await axios.post(accessTokenApiPath, body);
    } catch (err1) {
        let errData = logHelpers.parseApiErrorResponse(err1);
        let errMsg = "Something went wrong while getting app access token.";
        if (
            errData.data != null &&
            typeof errData.data.message != "undefined" &&
            errData.data.message != null &&
            errData.data.message != ""
        ) {
            errMsg = errMsg + " " + errData.data.message;
        }
        logHelpers.logError(errMsg, err1);
        let statusCode = errData.statusCode;
        let errorData = {
            statusCode: statusCode,
            message: errMsg,
            code: "API_ACCESS_TOKEN_ERROR",
        };
        return responseHelpers.generateResponseHtml(res, null, errorData, null);
    }

    if (accessTokenResponse == null) {
        let errMsg = "Something went wrong while fetching api access token.";
        logHelpers.logError(errMsg + " accessTokenResponse is null");
        let statusCode = 400;
        let errorData = {
            statusCode: statusCode,
            message: errMsg,
            code: "KPI_ACCESS_TOKEN_ERROR",
        };
        return responseHelpers.generateResponseHtml(res, null, errorData, null);
    }

    accessToken = accessTokenResponse.data.results.accessToken;

    // Validate apptoken using /sso/inbound/detail
    let appDetailsResponse = null;
    let appDetails = null;

    let appDetailsApiPath = process.env.APP_DETAIL_ENDPOINT;
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
        let errData = logHelpers.parseApiErrorResponse(err2);
        let errMsg = "Something went wrong while getting app access token.";
        if (
            errData.data != null &&
            typeof errData.data.message != "undefined" &&
            errData.data.message != null &&
            errData.data.message != ""
        ) {
            errMsg = errMsg + " " + errData.data.message;
        }
        logHelpers.logError(errMsg, err2);
        let statusCode = errData.statusCode;
        let errorData = {
            statusCode: statusCode,
            message: errMsg,
            code: "KPI_APP_DETAILS_ERROR",
        };
        return responseHelpers.generateResponseHtml(res, null, errorData, null);
    }

    if (appDetailsResponse == null) {
        let errMsg = "Something went wrong while fetching app details.";
        logHelpers.logError(errMsg + " appDetailsResponse is null");
        let statusCode = 400;
        let errorData = {
            statusCode: statusCode,
            message: errMsg,
            code: "KPI_APP_DETAILS_ERROR",
        };
        return responseHelpers.generateResponseHtml(res, null, errorData, null);
    }

    appDetails = appDetailsResponse.data;
    let rootCompaniesId = appDetails.results.rootCompanies;

    // Fetch pem file
    let samlPublicCertPath = appDetails.results.idpPublicCertificate;
    let samlPublicCertResponse = null;

    try {
        samlPublicCertResponse = await axios.get(samlPublicCertPath);
    } catch (err2) {
        let errData = logHelpers.parseApiErrorResponse(err2);
        let errMsg = "Something went wrong while fetching saml idp cert file.";
        if (
            errData.data != null &&
            typeof errData.data.message != "undefined" &&
            errData.data.message != null &&
            errData.data.message != ""
        ) {
            errMsg = errMsg + " " + errData.data.message;
        }
        logHelpers.logError(errMsg, err2);
        let statusCode = errData.statusCode;
        let errorData = {
            statusCode: statusCode,
            message: errMsg,
            code: "SAML_IDP_CERT_FETCH_ERROR",
        };
        return responseHelpers.generateResponseHtml(res, null, errorData, null);
    }

    if (samlPublicCertResponse == null) {
        let errMsg = "Something went wrong while fetching saml idp cert file.";
        logHelpers.logError(errMsg + " samlPublicCertResponse is null");
        let statusCode = 400;
        let errorData = {
            statusCode: statusCode,
            message: errMsg,
            code: "SAML_IDP_CERT_FETCH_ERROR",
        };
        return responseHelpers.generateResponseHtml(res, null, errorData, null);
    }

    // Create launch entry in database
    let appTokenId = commonHelpers.generateUniqueId();

    let samlEndpoint = appDetails.results.entryEndpoint;
    let samlIssuer = appDetails.results.metadataEndpoint;
    let samlPublicCert = samlPublicCertResponse.data;
    let samlCertSigAlgo = appDetails.results.idpPublicCertificateAlgo;
    if (
        typeof samlCertSigAlgo == "undefined" ||
        samlCertSigAlgo == null ||
        samlCertSigAlgo == ""
    ) {
        samlCertSigAlgo = "SHA-1";
    }
    let samlAttrMappings = appDetails.results.mappingsOfSAMLAttributes;

    let dataForAppDetails = {
        id: null,
        app_token_id: appTokenId,
        app_token: appToken,
        kpi_access_token: accessToken,
        root_companies_id: rootCompaniesId,
        saml_endpoint: samlEndpoint,
        saml_issuer: samlIssuer,
        saml_pub_cert: samlPublicCert,
        saml_cert_sig_algo: samlCertSigAlgo,
        saml_attr_mappings: samlAttrMappings,
        created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        updated_at: null,
    };

    let createAppDetails = null;

    try {
        createAppDetails = await Models.AppDetails.create(dataForAppDetails);
        logHelpers.logMessage(
            "Entry created in sib_appdetails: id = " + createAppDetails.id
        );
    } catch (dbErr1) {
        let errMsg = "Error while creating entry in database for app details";
        logHelpers.logError(errMsg, dbErr1);
        let statusCode = 400;
        let errorData = {
            statusCode: statusCode,
            message: errMsg,
            code: "DB_ERROR",
        };
        return responseHelpers.generateResponseHtml(res, null, errorData, null);
    }

    if (createAppDetails == null) {
        let errMsg = "Error while creating entry in database for app details.";
        logHelpers.logError(errMsg + " createAppDetails is null", null);
        let statusCode = 400;
        let errorData = {
            statusCode: statusCode,
            message: errMsg,
            code: "DB_ERROR",
        };
        return responseHelpers.generateResponseHtml(res, null, errorData, null);
    }

    /**
     *  SAML Details from database
     */
    let samlAppDetails = await Models.AppDetails.findOne({
        where: { app_token_id: appTokenId },
    });
    /**
     *  SAML credentials from database
     */
    let callbackUrl =
        process.env.GATEWAY_URL +
        `/login/sso-redirect?appTokenId=${appTokenId}`;
    let entryPoint = samlAppDetails.saml_endpoint;
    let issuer = samlAppDetails.saml_issuer;
    let signatureAlgorithm = samlAppDetails.saml_cert_sig_algo;
    let cert = samlAppDetails.saml_pub_cert;

    passport.use(
        "kpi-saml",
        new SamlStrategy(
            {
                callbackUrl: callbackUrl,
                entryPoint: entryPoint,
                issuer: issuer,
                signatureAlgorithm: signatureAlgorithm,
                cert: cert,
            },
            function (profile, done) {
                return done(null, profile);
            }
        )
    );

    let redirectTo = process.env.GATEWAY_URL + `/login/sso`;
    return res.redirect(redirectTo);
});

router.get("/sso", (req, res, next) =>
    passport.authenticate("kpi-saml", (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            let err1 = new Error("Not authenticated");
            return next(err1);
        }

        return user;
    })(req, res, next)
);

router.post(
    "/sso-redirect",
    passport.authenticate("kpi-saml", {
        failureRedirect: "/",
        failureFlash: true,
    }),
    (req, res, next) => {
        next();
    },
    async (req, res) => {
        let appTokenId = req.query.appTokenId;

        let appDetails = null;

        try {
            appDetails = await Models.AppDetails.findOne({
                where: { app_token_id: appTokenId },
            });
        } catch (dbErr1) {
            let errMsg = "Error while getting app details from database";
            logHelpers.logError(errMsg, dbErr1);
            let statusCode = 400;
            let errorData = {
                statusCode: statusCode,
                message: errMsg,
                code: "DB_ERROR",
            };
            return responseHelpers.generateResponseHtml(
                res,
                null,
                errorData,
                null
            );
        }

        if (appDetails == null) {
            let errMsg = "Error while getting app details from database.";
            logHelpers.logError(errMsg + " appDetails is null", null);
            let statusCode = 400;
            let errorData = {
                statusCode: statusCode,
                message: errMsg,
                code: "DB_ERROR",
            };
            return responseHelpers.generateResponseHtml(
                res,
                null,
                errorData,
                null
            );
        }

        // saml attributes mappings
        let samlUser = await samlHelpers.createUserSession(
            req,
            res,
            appDetails.saml_attr_mappings
        );

        let {
            userName: providerUserName,
            email: providerEmail,
            firstName: providerFirstName,
            lastName: providerLastName,
            patientFhirId: patientFhirId,
            patientFistname: patientFirstname,
            patientLastname: patientLastname,
            patientGender: patientGender,
            patientDob: patientDOB,
            patientMrn: patientMrn,
        } = samlUser;

        let appLoginDetails = null;
        let appLoginApiPath = process.env.APP_LOGIN_ENDPOINT;
        let headers2 = {};
        headers2.Authorization = appDetails.kpi_access_token;
        let options2 = {
            headers: headers2,
        };

        let contextData = [];
        let contextDataObj = {};
        let appLoginData = {};

        // Check if patient parameters are passed within saml assertion
        if (patientFirstname != null) {
            contextDataObj.CONTEXT_ID = appDetails.app_token_id;
            contextDataObj.PATIENT_FHIR_ID = patientFhirId;
            contextDataObj.PATIENT_FIRST = patientFirstname;
            contextDataObj.PATIENT_LAST = patientLastname;
            contextDataObj.PATIENT_GENDER = patientGender;
            contextDataObj.PATIENT_DOB = patientDOB;
            contextDataObj.PATIENT_MRN = patientMrn;
            contextData.push(contextDataObj);
        }

        appLoginData = {
            apptoken: appDetails.app_token,
            username:
                typeof providerUserName != "undefined"
                    ? providerUserName
                    : null,
            email: typeof providerEmail != "undefined" ? providerEmail : null,
            fname:
                typeof providerFirstName != "undefined"
                    ? providerFirstName
                    : null,
            lname:
                typeof providerLastName != "undefined"
                    ? providerLastName
                    : null,
            context: contextData,
        };

        try {
            appLoginDetails = await axios.post(
                appLoginApiPath,
                appLoginData,
                options2
            );
        } catch (appLoginErr) {
            let errData = logHelpers.parseApiErrorResponse(appLoginErr);
            let errMsg = "App login failed.";
            if (
                errData.data != null &&
                typeof errData.data.message != "undefined" &&
                errData.data.message != null &&
                errData.data.message != ""
            ) {
                errMsg = errMsg + " " + errData.data.message;
            }
            logHelpers.logError(errMsg, appLoginErr);
            let statusCode = errData.statusCode;
            let errorData = {
                statusCode: statusCode,
                message: errMsg,
                code: "KPI_APP_LOGIN_ERROR",
            };
            return responseHelpers.generateResponseHtml(
                res,
                null,
                errorData,
                null
            );
        }

        if (appLoginDetails == null) {
            let errMsg =
                "Something went wrong while fetching app login details";
            logHelpers.logError(errMsg + " appLoginDetails is null");
            let statusCode = 400;
            let errorData = {
                statusCode: statusCode,
                message: errMsg,
                code: "KPI_APP_LOGIN_ERROR",
            };
            return responseHelpers.generateResponseHtml(
                res,
                null,
                errorData,
                null
            );
        }

        let appLandingUri = appLoginDetails.data.results.landingURL;

        return res.redirect(appLandingUri);
    }
);

module.exports = router;

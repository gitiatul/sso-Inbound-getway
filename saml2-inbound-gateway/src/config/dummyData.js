// REMOVE remove this file before pushing to production
var fs = require("fs");
var path = require("path");

module.exports = {
    "59660e8f-3d0d-4b80-b921-0613a597677b": {
        callbackUrl: process.env.GATEWAY_URL + "/login/sso-redirect",
        entryPoint:
            "https://kpi-ninja-inc-dev.onelogin.com/trust/saml2/http-post/sso/a7345d1b-5312-40a7-af62-2a8eb47e7368",
        issuer: "https://app.onelogin.com/saml/metadata/a7345d1b-5312-40a7-af62-2a8eb47e7368",
        signatureAlgorithm: "SHA-1",
        cert: fs.readFileSync(
            path.join(__dirname, "..", "..", "ssl", "1login-idp.pem"),
            {
                encoding: "utf8",
            }
        ),
    },
    "8f1be8f9-5ae4-4827-8590-10217f26ec47": {
        callbackUrl: process.env.GATEWAY_URL + "/login/sso-redirect",
        entryPoint:
            "https://login.microsoftonline.com/ff526109-6467-4484-92b6-55b482bf34a2/saml2",
        issuer: "kpi-saml-inbound-gateway",
        signatureAlgorithm: "SHA-256",
        cert: fs.readFileSync(
            path.join(__dirname, "..", "..", "ssl", "azure-idp.cer"),
            {
                encoding: "utf8",
            }
        ),
    },
};

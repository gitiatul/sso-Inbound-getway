module.exports = {
  KPI_FAVICON:
    process.env.KPI_FAVICON ||
    "https://universe-prod-kpininja-s3.s3.amazonaws.com/universe_logo/kpininja-favicon.png",
  KPI_LOGO:
    process.env.KPI_LOGO ||
    "https://universe-prod-kpininja-s3.s3.amazonaws.com/universe_logo/kpiNinja.png",
  PRESHARED_KEY: process.env.PRESHARED_KEY || "preshared",
  API: {
    INBOUND_ADMIN_USERNAME: process.env.ADMIN_USERNAME || "inbound_access_user",
    INBOUND_ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "Test@1234",
    INBOUND_API_LOGIN_URI:
      process.env.API_LOGIN_ENDPOINT ||
      "https://universe-proxy-v4.testing.kpininja.com/api/newuauthmodule/api/login",
    INBOUND_APP_DETAIL_URI:
      process.env.APP_DETAIL_ENDPOINT ||
      "https://universe-proxy-v4.testing.kpininja.com/api/newusermodule/sso/inbound/detail",
    INBOUND_APP_LOGIN_URI:
      process.env.APP_LOGIN_ENDPOINT ||
      "https://universe-proxy-v4.testing.kpininja.com/api/newusermodule/sso/inbound/login",
  },
  ehrMetadata: {
    /**
     * application/json
     */
    1: "application/json",
    /**
     * application/xml
     */
    2: "application/xml",
  },
  /**
   * Location where to send client secret along with request
   */
  clientSecretTypes: {
    /**
     * Send client secret along with request, in request header in base64 format in combination with client id as a basic `Authorization` header
     */
    HEADER: "request_header",
    /**
     * Send client secret along with request, in request body as `client_secret`
     */
    BODY: "request_body",
  },
  userAttributesLocation: {
    TOKEN_RESPONSE: "token_response",
    ACCESS_TOKEN: "access_token",
    ID_TOKEN: "id_token",
  },
};

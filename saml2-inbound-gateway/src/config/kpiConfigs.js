module.exports = {
    AWS: {
        SECRET_NAME: process.env.AWS_SECRET_NAME || "kpi_saml_secrets_store",
        SECRET_REGION: process.env.AWS_SECRET_REGION || "us-east-1",
        ACCESS_KEY_ID:
            process.env.AWS_ACCESS_KEY_ID || "AKIAT3SE6MLTEUW2K4MI11111",
        SECRET_ACCESS_KEY:
            process.env.AWS_SECRET_ACCESS_KEY ||
            "J9wESkUOp9fC2fBeE7LkiaNAM5wUmCRgddnpBNJa11111",
        CREDENTIALS_PROFILE:
            process.env.AWS_CREDENTIALS_PROFILE || "nielpro-account",
    },
    KPI_FAVICON:
        process.env.KPI_FAVICON ||
        "https://universe-prod-kpininja-s3.s3.amazonaws.com/universe_logo/kpininja-favicon.png",
    KPI_LOGO:
        process.env.KPI_LOGO ||
        "https://universe-prod-kpininja-s3.s3.amazonaws.com/universe_logo/kpiNinja.png",
    API: {
        INBOUND_ADMIN_USERNAME:
            process.env.ADMIN_USERNAME || "inbound_access_user",
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
    SAML: {
        CALLBACK_URI:
            process.env.SAML_CALLBACK_URI ||
            process.env.GATEWAY_URL + "/login/sso-redirect",
    },
};

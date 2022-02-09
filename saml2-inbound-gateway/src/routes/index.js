var express = require("express");
var router = express.Router();

var { responseHelpers } = require("../helpers");
var loginRouter = require("./login");

router.get("/", async (req, res) => {
    let statusCode = 200;
    let successData = {
        statusCode: statusCode,
        message: "KPI SAML Inbound Gateway working",
    };
    return responseHelpers.generateResponseHtml(res, successData, null, null);
});

router.use("/login", loginRouter);

module.exports = router;

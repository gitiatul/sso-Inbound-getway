var responseHelpers = {
    /**
     * Generate API Respose JSON using parameters provided
     *
     * @param {Object} res Response Object
     * @param {Object} req Request Object
     * @param {string} msg Message|Error or Message or Error. (general message, success message or error message. If want to send both message & error, use pipe separeted string.). Default is empty string.
     * @param {number} code HTTP Status Code. Default is 400.
     * @param {string[]} data Response Payload. Default is empty array.
     *
     * @returns {string} API Respose in JSON format
     */
    generateApiResponse: async function (
        res,
        req,
        msg = "",
        code = 400,
        result = []
    ) {
        var message = "";
        var error = "";
        var requestToken = null;

        if (msg == "" || msg.split("|").length <= 1) {
            message = msg;
            error = msg;
        } else {
            let messages = msg.split("|");
            message = messages[0];
            error = messages[1];
        }

        if (code == 200) {
            error = "";
        }

        if (req != null && typeof req.query.request_token != "undefined") {
            requestToken = req.query.request_token;
        }

        // eslint-disable-next-line no-return-await
        return await res
            .set("Content-Type", "application/json")
            .status(code)
            .json({
                requestToken,
                code,
                message,
                error,
                result,
            });
    },
    /**
     * Generate html template for ejs template engine
     * @param {Object} res Response Object
     * @param {object} successData Success data object
     * @param {object} errorData Error data object
     * @param {object} pageMeta Page meta data object containing title, description, keywords
     * @param {object} images Images object
     * @returns Rendered html template for ejs template engine
     */
    generateResponseHtml: (
        res,
        successData = null,
        errorData = null,
        pageMeta = {
            title: "SAML Inbound Gateway | KPI Ninja",
            description: "KPI Ninja SAML Inbound Gateway",
            keywords: "KPI Ninja",
        },
        images = {
            favicon: process.env.KPI_FAVICON,
            logo: process.env.KPI_LOGO,
        }
    ) => {
        let templateName = "default";

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
            templateName = "error";
            pageData.data.error = errorData;
        }

        if (
            typeof successData != "undefined" &&
            successData != null &&
            successData != ""
        ) {
            templateName = "success";
            pageData.data.success = successData;
        }

        return res.render("pages/" + templateName, pageData);
    },
};

module.exports = responseHelpers;

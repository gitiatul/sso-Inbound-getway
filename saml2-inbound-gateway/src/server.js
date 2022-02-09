/* eslint-disable global-require */
const dotenv = require("dotenv");
const fs = require("fs");
let http = require("http");

let { logHelpers } = require("./helpers");
let { secretsManager, validationEnv } = require("./config");

// Validate initial environment setup using `process.env` values
if (validationEnv){
    let errorData = {
        statusCode: validationEnv.code,
        message: validationEnv.message,
        code: validationEnv.code,
    };

    logHelpers.logError(validationEnv.message, errorData);
    process.exit(-1);
}

const AWS_SECRET_NAME = process.env.AWS_SECRET_NAME;
const AWS_SECRET_REGION = process.env.AWS_SECRET_REGION;
const AWS_SECRET_FLAG = process.env.AWS_SECRET_FLAG;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
let secretKeys = {};
if (
    typeof AWS_SECRET_FLAG != "undefined" &&
    AWS_SECRET_FLAG == 1 &&
    typeof AWS_ACCESS_KEY_ID != "undefined" &&
    AWS_ACCESS_KEY_ID != null &&
    AWS_ACCESS_KEY_ID != "" &&
    typeof AWS_SECRET_ACCESS_KEY != "undefined" &&
    AWS_SECRET_ACCESS_KEY != null &&
    AWS_SECRET_ACCESS_KEY != ""
) {
    secretKeys.AWS_ACCESS_KEY_ID = AWS_ACCESS_KEY_ID;
    secretKeys.AWS_SECRET_ACCESS_KEY = AWS_SECRET_ACCESS_KEY;
}

(async () => {
    try {
        const envData = await secretsManager(
            AWS_SECRET_NAME,
            AWS_SECRET_REGION,
            AWS_SECRET_FLAG,
            secretKeys
        );

        if (envData.error.code != null && envData.error.message != null) {
            logHelpers.logError(envData.error.message, envData.error);
            process.exit(-1);
        }

        // write to .env file at root level of project:
        await fs.writeFile(".env.aws", envData.dataStr, (err) => {
            if (err) {
                logHelpers.logError(
                    "Error while creating .env.aws file using AWS Secret Manager.",
                    err
                );
                process.exit(-1);
            } else {
                // configure dotenv package
                dotenv.config({
                    path: ".env.aws",
                });

                let app = require("./app");

                let APP_PORT = process.env.APP_PORT || 5000;
                let GATEWAY_URL =
                    process.env.GATEWAY_URL || `http://localhost:${APP_PORT}`;

                // create http server
                let server = http.createServer(app);

                server.listen(APP_PORT, () => {
                    logHelpers.logMessage(
                        "Environment variables loaded from AWS Secrets Manager.\n" +
                            "App started successfully.\nServer running on: " +
                            GATEWAY_URL
                    );
                });
            }
        });
    } catch (error) {
        // log the error and crash the app
        logHelpers.logError("Error in setting environment variables.", error);
        process.exit(-1);
    }
})();

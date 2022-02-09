var joi = require("joi");

let validationEnv = "";
const envVarsSchema = joi
    .object()
    .keys({
        AWS_SECRET_NAME: joi.required().messages({
            "any.required": "AWS_SECRET_NAME",
        }),
        AWS_SECRET_REGION: joi.required().messages({
            "any.required": "AWS_SECRET_REGION",
        }),
        AWS_SECRET_FLAG: joi.required().messages({
            "any.required": "AWS_SECRET_FLAG",
        }),
        AWS_ACCESS_KEY_ID: joi.required().messages({
            "any.required": "AWS_ACCESS_KEY_ID",
        }),
        AWS_SECRET_ACCESS_KEY: joi.required().messages({
            "any.required": "AWS_SECRET_ACCESS_KEY",
        }),
    })
    .unknown();

const { error } = envVarsSchema.validate(
    {
        AWS_SECRET_NAME: process.env.AWS_SECRET_NAME,
        AWS_SECRET_REGION: process.env.AWS_SECRET_REGION,
        AWS_SECRET_FLAG: process.env.AWS_SECRET_FLAG,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    },
    { abortEarly: false }
);

if (error) {
    validationEnv = error;
    validationEnv.code = 500;
    validationEnv.message =
        validationEnv.message.replace(/\./g, ",") +
        " parameters are missing in initial environment setup.";
}

module.exports = validationEnv;

"use strict";

let AWS = require("aws-sdk");

let kpiConfigs = require("./kpiConfigs");

const AWS_ACCESS_KEY_ID = kpiConfigs.AWS.ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = kpiConfigs.AWS.SECRET_ACCESS_KEY;
const AWS_CREDENTIALS_PROFILE = kpiConfigs.AWS.CREDENTIALS_PROFILE;

const secretsManager = async (secretName, region, keyFlag = false) => {
  let response = {};
  response.error = {};
  response.error.code = null;
  response.error.message = null;
  response.data = null;
  /** */
  let secretValue = {
    ARN: "arn:aws:secretsmanager:us-east-1:265358828262:secret:kpi_saml_secrets_store-LhJxHY",
    Name: "kpi_saml_secrets_store",
    VersionId: "4c9bde07-8d0d-4590-97cd-e75c956f9d6b",
    SecretString:
      '{"TEST_ENV_KEY":"TEST_ENV_VALUE","NODE_ENV": "development","APP_PORT": 5000,"GATEWAY_URL": "https://localhost:5000","DB_TYPE": "mysql","DB_HOST": "localhost","DB_PORT": 3306,"DB_NAME": "kpi_sso_inbound","DB_USER": "root","DB_PASS": "","DB_MAX_CON": 10,"DB_MIN_CON": 0,"DB_ACQUIRE_TIMEOUT": 30000,"DB_IDLE_TIMEOUT": 10000,"ERR_404": "Resource not found.","ERR_501": "Method not implemented.","LOGGER_SIZE": "10M","LOGGER_MAX_SIZE": "1G","LOGGER_INTERVAL": "1M","ADMIN_USERNAME": "naren.parimi","ADMIN_PASSWORD": "Test@123","API_LOGIN_ENDPOINT": "https://proxy-demo.wishin.org/api/newuauthmodule/api/login","APP_DETAIL_ENDPOINT": "https://proxy-demo.wishin.org/api/newusermodule/sso/inbound/detail","APP_LOGIN_ENDPOINT": "https://proxy-demo.wishin.org/api/newusermodule/sso/inbound/login","KPI_FAVICON": "https://universe-prod-kpininja-s3.s3.amazonaws.com/universe_logo/kpininja-favicon.png","KPI_LOGO": "https://universe-prod-kpininja-s3.s3.amazonaws.com/universe_logo/kpiNinja.png"}',
    VersionStages: ["AWSCURRENT"],
    CreatedDate: "2021-12-03T13:37:44.736Z",
  };

  if ("SecretString" in secretValue) {
    response.data = JSON.parse(secretValue.SecretString);
  } else {
    let buff = Buffer.from(secretValue.SecretBinary, "base64");
    response.data = JSON.parse(buff.toString("ascii"));
  }
  /** *
  const config = {
    region: region,
  };

  if (!keyFlag) {
    config.accessKeyId = AWS_ACCESS_KEY_ID;
    config.secretAccessKey = AWS_SECRET_ACCESS_KEY;
  }

  if (keyFlag) {
    let credentials = new AWS.SharedIniFileCredentials({
      profile: AWS_CREDENTIALS_PROFILE,
    });
    config.accessKeyId = credentials.accessKeyId;
    config.secretAccessKey = credentials.secretAccessKey;
  }

  let SM = new AWS.SecretsManager(config);

  try {
    let secretValue = await SM.getSecretValue({
      SecretId: secretName,
    }).promise();

    if ("SecretString" in secretValue) {
      response.data = JSON.parse(secretValue.SecretString);
    } else {
      let buff = Buffer.from(secretValue.SecretBinary, "base64");
      response.data = JSON.parse(buff.toString("ascii"));
    }
  } catch (err) {
    response.error.message = err.message;
    response.error.code = err.code;
  }
  /** */
  return response;
};

module.exports = secretsManager;

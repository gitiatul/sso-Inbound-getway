var axiosCofig = require("./axios-config");
var passport = require("./passport");
var secretsManager = require("./secretsManager");
var validationEnv = require("./validateInitialConfigs");

module.exports = {
    /**
     * API helper using axios
     */
    axios: axiosCofig,
    passport: passport,
    /**
     * Uses AWS Secrets Manager to retrieve a secret
     * @param {String} secretName Secret store name
     * @param {String} region Region
     * @param {Boolean} keyFlag Flag for use of access id & secret access key. If `true`, it will use access id & secret access key, otherwise not
     * @param {Object} secretKeys Secret keys to be used in conjunction with `keyFlag`. If `keyFlag` is `true`, `secretKeys` is required
     * @returns Returns secret manager object
     */
    secretsManager: secretsManager,
    validationEnv: validationEnv,
};

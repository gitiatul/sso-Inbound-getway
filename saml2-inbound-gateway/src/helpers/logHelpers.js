var commonHelper = require("./commonHelpers");

var logHelpers = {
    generator: (time, index) => {
        if (!time) return "access.log";

        let month =
            time.getFullYear() + "" + commonHelper.pad(time.getMonth() + 1);
        let day = commonHelper.pad(time.getDate());
        let hour = commonHelper.pad(time.getHours());
        let minute = commonHelper.pad(time.getMinutes());

        return `${month}/${month}${day}-${hour}${minute}-${index}-access.log.gz`;
    },
    /**
     * Log error message to console.
     * @param {string} msg Error Message
     * @param {object} err Actual error stack object
     */
    logError: (msg = "Something went wrong.", err = null) => {
        // eslint-disable-next-line no-console
        console.error(
            "\n----------------\nError Start\n----------------\nTimestamp: " +
                new Date() +
                "\n\n" +
                msg +
                "\n",
            err,
            "\n----------------\nError End\n----------------\n"
        );
    },
    /**
     * Log general message to console.
     * @param {string} msg Error Message
     */
    logMessage: (msg = "Task completed successfully.") => {
        // eslint-disable-next-line no-console
        console.log(
            "\n----------------\nMessage Start\n----------------\nTimestamp: " +
                new Date() +
                "\n\n" +
                msg +
                "\n----------------\nMessage End\n----------------\n"
        );
    },
    parseApiErrorResponse: (err = null) => {
        let errData = {};
        errData.statusCode = 400;
        errData.data = null;

        if (
            typeof err == "undefined" ||
            err == null ||
            err == "" ||
            typeof err.response == "undefined" ||
            err.response == null ||
            err.response == ""
        ) {
            return errData;
        }

        if (
            typeof err.response.status != "undefined" &&
            err.response.status != null &&
            err.response.status != ""
        ) {
            errData.statusCode = err.response.status;
        }

        if (
            typeof err.response.data != "undefined" &&
            err.response.data != null &&
            err.response.data != ""
        ) {
            errData.data = err.response.data;
        }

        return errData;
    },
};

module.exports = logHelpers;

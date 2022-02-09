/* eslint-disable eqeqeq */
var { v4: uuidv4 } = require("uuid");

var commonHelpers = {
    pad: (num) => {
        return (num > 9 ? "" : "0") + num;
    },
    /**
     * Generate unique id using UUID v4 standard.
     *
     * @returns Unique id using UUID v4 standard.
     */
    generateUniqueId: () => {
        return uuidv4();
    },
};

module.exports = commonHelpers;

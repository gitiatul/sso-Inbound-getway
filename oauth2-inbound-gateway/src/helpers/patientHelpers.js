var helpers = require("./helpers");
var moment = require("moment");

var patientHelpers = {
  /**
   *Extract patient details in custome format from Patient R4 FHIR resource
   * @param {object} patientResource Patient R4 FHIR resource
   * @returns patient details in custom object format
   */
  extractPatientData: (patientResource = null) => {
    let patientDetails = {};
    /**
     * Patient MRN. Default value is null.
     */
    patientDetails.patientMrn = null;
    /**
     * Patient Birthdate. Default value is null.
     */
    patientDetails.patientDob = null;
    /**
     * Patient First. Default value is null.
     */
    patientDetails.patientFirstName = null;
    /**
     * Patient Middle name. Default value is null.
     */
    patientDetails.patientMiddleName = null;
    /**
     * Patient Last name. Default value is null.
     */
    patientDetails.patientLastName = null;
    /**
     * Patient Full Name. Default value is null.
     */
    patientDetails.patientFullName = null;
    /**
     * Patient Gender. Default value is null.
     */
    patientDetails.patientGender = null;
    /**
     * Patient Marital Status. Default value is null.
     */
    patientDetails.patientMaritalStatus = null;

    if (
      typeof patientResource == "undefined" ||
      patientResource == null ||
      patientResource == ""
    ) {
      helpers.logError("Invalid patient resource.");
      return patientDetails;
    }

    // Patient MRN using 'MRN' key
    let patientMrnElementMrn = patientResource.identifier.find(
      (element) =>
        typeof element.type != "undefined" && element.type.text == "MRN"
    );
    if (
      typeof patientMrnElementMrn != "undefined" &&
      typeof patientMrnElementMrn.value != "undefined"
    ) {
      patientDetails.patientMrn = patientMrnElementMrn.value;
    }

    if (patientDetails.patientMrn == null) {
      // Patient MRN using 'EPI' key
      let patientMrnElement = patientResource.identifier.find(
        (element) =>
          typeof element.type != "undefined" && element.type.text == "EPI"
      );
      if (
        typeof patientMrnElement != "undefined" &&
        typeof patientMrnElement.value != "undefined"
      ) {
        patientDetails.patientMrn = patientMrnElement.value;
      }
    }

    // Patient Dob
    if (typeof patientResource.birthDate != "undefined") {
      patientDetails.patientDob = patientResource.birthDate;
    }

    // Patient Name
    let patientNameArr = patientResource.name;
    let patientNameElement = patientNameArr.find(
      (element) => element.use === "official"
    );
    if (
      typeof patientNameElement == "undefined" ||
      patientNameElement == null ||
      patientNameElement == ""
    ) {
      patientNameElement = patientNameArr.find(
        (element) => element.use === "usual"
      );
    }
    if (
      typeof patientNameElement == "undefined" ||
      patientNameElement == null ||
      patientNameElement == ""
    ) {
      patientNameElement = patientNameArr.find(
        (element) => element.use === "usual"
      );
    }

    if (typeof patientNameElement != "undefined") {
      // Patient first name
      patientDetails.patientFirstName =
        typeof patientNameElement.given &&
        typeof patientNameElement.given[0] != "undefined"
          ? patientNameElement.given[0]
          : null; // given[0]

      // Patient middle name
      patientDetails.patientMiddleName =
        typeof patientNameElement.given &&
        typeof patientNameElement.given[1] != "undefined"
          ? patientNameElement.given[1]
          : null; // given[1]

      // Patient last name
      patientDetails.patientLastName =
        typeof patientNameElement.family != "undefined"
          ? patientNameElement.family
          : null; // family

      // Patient full name
      patientDetails.patientFullName =
        typeof patientNameElement.text != "undefined"
          ? patientNameElement.text
          : null; // text
    }

    // Patient gender
    if (typeof patientResource.gender != "undefined") {
      patientDetails.patientGender = patientResource.gender;
    }

    // Patient marital status
    if (
      typeof patientResource.maritalStatus != "undefined" &&
      typeof patientResource.maritalStatus.text != "undefined"
    ) {
      patientDetails.patientMaritalStatus = patientResource.maritalStatus.text;
    }

    return patientDetails;
  },
  /**
   * Generate patient data payload to submit to KPI app login api
   * @param {string} contextId Context id
   * @param {object} patientDetails Patient details extracted from EHR
   * @returns patient data payload to submit to KPI app login api
   */
  generatePatientPayload: (contextId = null, patientDetails = null) => {
    let contextPayload = [
      {
        contextId: contextId,
      },
      {
        pFname: patientDetails.patientFirstName,
      },
      {
        pLName: patientDetails.patientLastName,
      },
      {
        pGender: patientDetails.patientGender,
      },
      {
        pDOB: moment(patientDetails.patientDob).format("DD/MM/YYYY"),
      },
      {
        pMRN: patientDetails.patientMrn,
      },
    ];

    return contextPayload;
  },
};

module.exports = patientHelpers;

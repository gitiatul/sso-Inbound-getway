var axios = require("../config/axios-config");
var helpers = require("./helpers");

var practitionerHelpers = {
  /**
   * Get Practitioner Data using Practitioner.Read (R4) resource
   * @param {string} fhirApiBasePath FHIR API base path. (Required)
   * @param {string} accessToken EHR Access Token. (Required)
   * @param {string} prectitionerFhirId Practitioner FHIR Id(Required)
   */
  getPractitioner: async (fhirApiBasePath, accessToken, prectitionerFhirId) => {
    let apiPath = fhirApiBasePath + "/Practitioner/" + prectitionerFhirId;

    let headers = {};
    if (accessToken.startsWith("Bearer ") == true) {
      headers.Authorization = accessToken;
    }
    if (accessToken.startsWith("Bearer ") != true) {
      headers.Authorization = "Bearer " + accessToken;
    }

    let options = {
      headers: headers,
    };

    let practitionerData = await axios.get(apiPath, options);

    return practitionerData;
  },
  /**
   *Extract practitioner details in custome format from Practitioner R4 FHIR resource
   * @param {object} practitionerResource Practitioner R4 FHIR resource
   * @returns Practitioner details in custom object format
   */
  extractPractitionerData: (practitionerResource = null) => {
    let practitionerDetails = {};
    /**
     * Practitioner username.
     * If username not available in fhir resource, fhir id will be returned as username. Default value is null.
     */
    practitionerDetails.username = null;
    /**
     * Practitioner email. Default value is null.
     */
    practitionerDetails.email = null;
    /**
     * Practitioner first name. Default value is null.
     */
    practitionerDetails.first = null;
    /**
     * Practitioner middle name. Default value is null.
     */
    practitionerDetails.middle = null;
    /**
     * Practitioner last name. Default value is null.
     */
    practitionerDetails.last = null;
    /**
     * Practitioner full name. Default value is null.
     */
    practitionerDetails.fullName = null;

    if (
      typeof practitionerResource == "undefined" ||
      practitionerResource == null ||
      practitionerResource == ""
    ) {
      helpers.logError("Invalid practitioner resource.");
      return practitionerDetails;
    }

    // Practitioner username
    if (typeof practitionerResource.id != "undefined") {
      practitionerDetails.username = practitionerResource.id;
    }

    // Practitioner email
    let practitionerTelecomArr = null;
    let practitionerEmailElement = null;
    if (typeof practitionerResource.telecom != "undefined") {
      practitionerTelecomArr = practitionerResource.telecom;
    }

    if (practitionerTelecomArr != null) {
      practitionerEmailElement = practitionerTelecomArr.find(
        (element) => element.system === "email"
      );
    }

    if (practitionerEmailElement != null) {
      practitionerDetails.email = practitionerEmailElement.value;
    }

    // Practitioner Name
    let practitionerNameArr = practitionerResource.name;
    let practitionerNameElement = practitionerNameArr.find(
      (element) => element.use === "official"
    );
    if (
      typeof practitionerNameElement == "undefined" ||
      practitionerNameElement == null ||
      practitionerNameElement == ""
    ) {
      practitionerNameElement = practitionerNameArr.find(
        (element) => element.use === "usual"
      );
    }
    if (
      typeof practitionerNameElement == "undefined" ||
      practitionerNameElement == null ||
      practitionerNameElement == ""
    ) {
      practitionerNameElement = practitionerNameArr.find(
        (element) => element.use === "usual"
      );
    }

    if (typeof practitionerNameElement != "undefined") {
      // Practitioner first name
      practitionerDetails.first =
        typeof practitionerNameElement.given &&
        typeof practitionerNameElement.given[0] != "undefined"
          ? practitionerNameElement.given[0]
          : null; // given[0]

      // Practitioner middle name
      practitionerDetails.middle =
        typeof practitionerNameElement.given &&
        typeof practitionerNameElement.given[1] != "undefined"
          ? practitionerNameElement.given[1]
          : null; // given[1]

      // Practitioner last name
      practitionerDetails.last =
        typeof practitionerNameElement.family != "undefined"
          ? practitionerNameElement.family
          : null; // family

      // Practitioner full name
      practitionerDetails.fullName =
        typeof practitionerNameElement.text != "undefined"
          ? practitionerNameElement.text
          : null; // text
    }

    return practitionerDetails;
  },
};

module.exports = practitionerHelpers;

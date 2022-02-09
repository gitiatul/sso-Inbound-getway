var samlHelpers = {
    /**
     * Extract user information such as username, email, first name, last name from saml response received from SAML IDP after successful authentication
     * @param {object} req Request Object
     * @param {object} res Response Object
     * @param {string} smalAttrMappings SAML attribute mappings which will be used to map attributes from saml response to KPI attributes
     * @returns Returns user object containing user information such as username, email, first name, last name extracted from saml response received from SAML IDP after successful authentication
     */
    createUserSession: async (req, res, smalAttrMappings) => {
        let samlMappingArr = smalAttrMappings.split(",");

        let samlMappingJson = {};

        samlMappingArr.forEach((entry) => {
            let dataArr = entry.split(":");
            samlMappingJson[dataArr[0]] = dataArr[1];
        });

        let nameID = req.user[samlMappingJson.nameID];
        let UserName = req.user[samlMappingJson.UserName];
        let Email = req.user[samlMappingJson.Email];
        let FirstName = req.user[samlMappingJson.FirstName];
        let LastName = req.user[samlMappingJson.LastName];
        let PatientDob =
            typeof req.user[samlMappingJson.PatientDob] != "undefined"
                ? req.user[samlMappingJson.PatientDob]
                : null;
        let PatientFirstName =
            typeof req.user[samlMappingJson.PatientFirstName] != "undefined"
                ? req.user[samlMappingJson.PatientFirstName]
                : null;
        let PatientLastName =
            typeof req.user[samlMappingJson.PatientLastName] != "undefined"
                ? req.user[samlMappingJson.PatientLastName]
                : null;
        let PatientGender =
            typeof req.user[samlMappingJson.PatientGender] != "undefined"
                ? req.user[samlMappingJson.PatientGender]
                : null;
        let PatientFhirId =
            typeof req.user[samlMappingJson.PatientFhirId] != "undefined"
                ? req.user[samlMappingJson.PatientFhirId]
                : null;
        let PatientMrn =
            typeof req.user[samlMappingJson.PatientMrn] != "undefined"
                ? req.user[samlMappingJson.PatientMrn]
                : null;

        let user = null;
        if (nameID != "undefined") {
            user = {
                nameId: nameID,
                userName: UserName,
                email: Email,
                firstName: FirstName,
                lastName: LastName,
                patientDob: PatientDob,
                patientFistname: PatientFirstName,
                patientLastname: PatientLastName,
                patientGender: PatientGender,
                patientFhirId: PatientFhirId,
                patientMrn: PatientMrn,
            };
        }
        if (!user || user == null) {
            return res.send({
                error: "User Not Found",
            });
        }
        return user;
    },
};

module.exports = samlHelpers;

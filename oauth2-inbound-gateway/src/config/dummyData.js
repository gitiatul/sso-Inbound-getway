// REMOVE remove this file before pushing to production
var kpiConfigs = require("./kpiConfigs");

module.exports = {
  "AAAA-1": {
    APP_FOR: "Dummy creds for parag-thoughti azure",
    CLIENT_ID: "8144e917-373c-4ef3-aec1-3a8213c90553",
    CLIENT_SECRET: "Xg17Q~YXbpw9OGvJs.tBM3PIHT0EaYxki_ono",
    CLIENT_SECRET_TYPE: kpiConfigs.clientSecretTypes.BODY,
    APP_SCOPE: "openid profile email User.Read",
    AUTHORIZE_ENDPOINT:
      "https://login.microsoftonline.com/ff526109-6467-4484-92b6-55b482bf34a2/oauth2/v2.0/authorize",
    TOKEN_ENDPOINT:
      "https://login.microsoftonline.com/ff526109-6467-4484-92b6-55b482bf34a2/oauth2/v2.0/token",
    AUDIENCE_ENDPOINT: null,
    USER_ATTRIBUTES_LOCATION: kpiConfigs.userAttributesLocation.ACCESS_TOKEN,
    USER_ATTRIBUTES_MAPPINGS:
      "username:email,email:email,fname:given_name,lname:family_name,user_fhir_id:null,patient_fhir_id:null,patient_dob:null,patient_fname:null,patient_lname:null,patient_gender:null,patient_mrn:null",
  },
  "e2e8e197-c8ac-4954-8191-350177107db1": {
    APP_FOR: "Dummy creds for Inclusa",
    CLIENT_ID: "cc3cc931-94f9-40ef-9915-b8bd03ea2356",
    CLIENT_SECRET: null,
    CLIENT_SECRET_TYPE: kpiConfigs.clientSecretTypes.BODY,
    APP_SCOPE: "openid profile",
    AUTHORIZE_ENDPOINT:
      "https://login.microsoftonline.com/5788c51f-54a3-47b8-81a9-49fbe26f48cc/oauth2/v2.0/authorize",
    TOKEN_ENDPOINT:
      "https://login.microsoftonline.com/5788c51f-54a3-47b8-81a9-49fbe26f48cc/oauth2/v2.0/token",
    AUDIENCE_ENDPOINT: null,
    USER_ATTRIBUTES_LOCATION: kpiConfigs.userAttributesLocation.ID_TOKEN,
    USER_ATTRIBUTES_MAPPINGS:
      "username:preferred_username,email:email,fname:given_name,lname:family_name,user_fhir_id:null,patient_fhir_id:null,patient_dob:null,patient_fname:null,patient_lname:null,patient_gender:null,patient_mrn:null",
  },
  "0edeceaa-05d5-4eb6-9d2a-a3994accd2fb": {
    APP_FOR: "Dummy creds for MyChoice",
    CLIENT_ID: "qbync-gwj1c-300u4-hmuie-aol4h",
    CLIENT_SECRET: "gRowptsIVxVs2FGNNdDXCNRO9Dt3WJ3z",
    CLIENT_SECRET_TYPE: kpiConfigs.clientSecretTypes.HEADER,
    APP_SCOPE: "READ",
    AUTHORIZE_ENDPOINT:
      "https://dev.mcfc-midas.com/clientManagement/wishinSsov2.aspx",
    TOKEN_ENDPOINT:
      "https://dev.mcfc-midas.com/clientManagement/wishinSsov2.aspx",
    AUDIENCE_ENDPOINT: null,
    USER_ATTRIBUTES_LOCATION: kpiConfigs.userAttributesLocation.TOKEN_RESPONSE,
    USER_ATTRIBUTES_MAPPINGS:
      "username:user_id,email:user_email,fname:user_fname,lname:user_lname,user_fhir_id:user,patient_fhir_id:patient,patient_dob:PATIENT_DOB,patient_fname:PATIENT_FIRST,patient_lname:PATIENT_LAST,patient_gender:PATIENT_GENDER,patient_mrn:PATIENT_MRN",
  },
  "ddb3e998-b553-409b-ada0-44a42ac6e01d": {
    APP_FOR: "Dummy creds for Open Epic",
    CLIENT_ID: "ceae9d6a-fb64-4caf-bb7b-eb3a84d7dae1",
    CLIENT_SECRET: null,
    CLIENT_SECRET_TYPE: kpiConfigs.clientSecretTypes.HEADER,
    APP_SCOPE:
      "launch profile fhirUser openid online_access patient/Patient.read practitioner/Practitioner.read",
    AUTHORIZE_ENDPOINT:
      "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize",
    TOKEN_ENDPOINT:
      "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token",
    AUDIENCE_ENDPOINT:
      "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4",
    USER_ATTRIBUTES_LOCATION: kpiConfigs.userAttributesLocation.TOKEN_RESPONSE,
    USER_ATTRIBUTES_MAPPINGS:
      "username:user_id,email:user_email,fname:user_fname,lname:user_lname,user_fhir_id:user,patient_fhir_id:patient,patient_dob:PATIENT_DOB,patient_fname:PATIENT_FIRST,patient_lname:PATIENT_LAST,patient_gender:PATIENT_GENDER,patient_mrn:PATIENT_MRN",
  },
  /**
   * Dummy creds for Cerner
   */
  "AAAA-2": {
    APP_FOR: "Dummy creds for Cerner",
    CLIENT_ID: "de10cd94-fd18-4125-bed9-8acbad16ac6a",
    CLIENT_SECRET: null,
    CLIENT_SECRET_TYPE: kpiConfigs.clientSecretTypes.BODY,
    APP_SCOPE:
      "launch profile fhirUser openid online_access patient/Patient.read user/Patient.read user/Practitioner.read",
    AUTHORIZE_ENDPOINT:
      "https://authorization.cerner.com/tenants/ec2458f2-1e24-41c8-b71b-0e701af7583d/protocols/oauth2/profiles/smart-v1/personas/provider/authorize",
    TOKEN_ENDPOINT:
      "https://authorization.cerner.com/tenants/ec2458f2-1e24-41c8-b71b-0e701af7583d/protocols/oauth2/profiles/smart-v1/token",
    AUDIENCE_ENDPOINT:
      "https://fhir-ehr-code.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d",
    USER_ATTRIBUTES_LOCATION: kpiConfigs.userAttributesLocation.TOKEN_RESPONSE,
    USER_ATTRIBUTES_MAPPINGS:
      "username:user_id,email:user_email,fname:user_fname,lname:user_lname,user_fhir_id:user,patient_fhir_id:patient,patient_dob:PATIENT_DOB,patient_fname:PATIENT_FIRST,patient_lname:PATIENT_LAST,patient_gender:PATIENT_GENDER,patient_mrn:PATIENT_MRN",
  },
};

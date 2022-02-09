"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("ib_appdetails", {
      id: {
        type: Sequelize.BIGINT(20),
        primaryKey: true,
        autoIncrement: true,
      },
      app_token_id: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: "Unique application token id generated in UUID4 format",
      },
      app_token: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: "Unique application token issued by KPI",
      },
      kpi_access_token: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: "API access token issued by KPI",
      },
      is_preshared: Sequelize.BOOLEAN,
      root_companies_id: {
        type: Sequelize.BIGINT(20),
        defaultValue: null,
        allowNull: true,
      },
      client_id: Sequelize.TEXT,
      client_secret: Sequelize.TEXT,
      client_secret_type: {
        type: Sequelize.STRING(50),
        defaultValue: "request_header",
      },
      ehr_response: Sequelize.TEXT("long"),
      iss: Sequelize.TEXT,
      authorization_endpoint: Sequelize.TEXT,
      token_endpoint: Sequelize.TEXT,
      audience_endpoint: Sequelize.TEXT,
      scope: Sequelize.TEXT,
      provider_fhir_id: Sequelize.TEXT,
      patient_fhir_id: Sequelize.TEXT,
      access_token: Sequelize.TEXT,
      access_token_expires_on: Sequelize.DATE,
      refresh_token: Sequelize.TEXT,
      id_token: Sequelize.TEXT,
      user_attr_location: {
        type: Sequelize.STRING(50),
        defaultValue: "token_response",
      },
      user_attr_mappings: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: "Mappings of user attributes between KPI & IDP token.",
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("ib_appdetails");
  },
};

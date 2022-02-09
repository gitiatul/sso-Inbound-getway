"use strict";

module.exports = (sequelize, DataTypes) => {
  const Facility = sequelize.define(
    "AppDetails",
    {
      id: {
        type: DataTypes.BIGINT(20),
        primaryKey: true,
        autoIncrement: true,
      },
      app_token_id: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Unique application token id generated in UUID4 format",
      },
      app_token: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Unique application token issued by KPI",
      },
      kpi_access_token: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "API access token issued by KPI",
      },
      is_preshared: DataTypes.BOOLEAN,
      root_companies_id: {
        type: DataTypes.BIGINT(20),
        defaultValue: null,
        allowNull: true,
      },
      client_id: DataTypes.TEXT,
      client_secret: DataTypes.TEXT,
      client_secret_type: {
        type: DataTypes.STRING(50),
        defaultValue: "request_header",
      },
      ehr_response: DataTypes.TEXT("long"),
      iss: DataTypes.TEXT,
      authorization_endpoint: DataTypes.TEXT,
      token_endpoint: DataTypes.TEXT,
      audience_endpoint: DataTypes.TEXT,
      scope: DataTypes.TEXT,
      provider_fhir_id: DataTypes.TEXT,
      patient_fhir_id: DataTypes.TEXT,
      access_token: DataTypes.TEXT,
      access_token_expires_on: DataTypes.DATE,
      refresh_token: DataTypes.TEXT,
      id_token: DataTypes.TEXT,
      user_attr_location: {
        type: DataTypes.STRING(50),
        defaultValue: "token_response",
      },
      user_attr_mappings: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Mappings of user attributes between KPI & IDP token.",
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      tableName: "ib_appdetails",
      timestamps: false,
      charset: "utf8",
      collate: "utf8mb4_bin",
    }
  );
  return Facility;
};

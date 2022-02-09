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
                comment:
                    "Unique application token id generated in UUID4 format",
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
            root_companies_id: {
                type: DataTypes.BIGINT(20),
                defaultValue: null,
                allowNull: true,
            },
            saml_endpoint: DataTypes.TEXT("long"),
            saml_issuer: DataTypes.TEXT("long"),
            saml_pub_cert: {
                type: DataTypes.TEXT("long"),
                defaultValue: null,
                allowNull: true,
                comment: "Public certificate of SAML Identity Provider",
            },
            saml_attr_mappings: {
                type: DataTypes.TEXT,
                allowNull: false,
                comment:
                    "Mappings of SAML attributes between KPI & IDP saml assertion.",
            },
            saml_cert_sig_algo: {
                type: DataTypes.TEXT("long"),
                defaultValue: "sha1",
                allowNull: true,
                comment:
                    "Final EHR response received after successful authentication",
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            tableName: "sib_appdetails",
            timestamps: false,
            charset: "utf8",
            collate: "utf8mb4_bin",
        }
    );
    return Facility;
};

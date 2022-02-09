"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("sib_appdetails", {
            id: {
                type: Sequelize.BIGINT(20),
                primaryKey: true,
                autoIncrement: true,
            },
            app_token_id: {
                type: Sequelize.TEXT,
                allowNull: false,
                comment:
                    "Unique application token id generated in UUID4 format",
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
            root_companies_id: {
                type: Sequelize.BIGINT(20),
                defaultValue: null,
                allowNull: true,
            },
            saml_endpoint: Sequelize.TEXT("long"),
            saml_issuer: Sequelize.TEXT("long"),
            saml_pub_cert: {
                type: Sequelize.TEXT("long"),
                defaultValue: null,
                allowNull: true,
                comment: "Public certificate of SAML IDP",
            },
            saml_attr_mappings: {
                type: Sequelize.TEXT,
                allowNull: false,
                comment:
                    "Mappings of SAML attributes between KPI & IDP saml assertion.",
            },
            saml_cert_sig_algo: {
                type: Sequelize.TEXT("long"),
                defaultValue: null,
                allowNull: true,
                comment:
                    "Final EHR response received after successful authentication",
            },
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE,
        });
    },
    // eslint-disable-next-line no-unused-vars
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("sib_appdetails");
    },
};

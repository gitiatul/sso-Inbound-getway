const pathConst = require("path");
require("dotenv").config({ path: pathConst.resolve(process.cwd(), ".env") });

const DB_TYPE = process.env.DB_TYPE;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = parseInt(process.env.DB_PORT, 10);
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS || null;
// Use a different storage type. Default: sequelize
const migrationStorage = "sequelize";
// Use a different table name. Default: SequelizeMeta
const migrationStorageTableName = "sequelize_meta";
// Use a different storage. Default: none
const seederStorage = "sequelize";
const seederStorageTableName = "sequelize_data";
const poolMax = parseInt(process.env.DB_MAX_CON, 10);
const poolMin = parseInt(process.env.DB_MIN_CON, 10);
const poolAcquire = parseInt(process.env.DB_ACQUIRE_TIMEOUT, 10);
const poolIdle = parseInt(process.env.DB_IDLE_TIMEOUT, 10);

const DEV_ENV = process.env.NODE_ENV || "development";
let logging = false;
if (DEV_ENV != "production") {
    // enable database query logging only in non-production environment.
    // eslint-disable-next-line no-console
    logging = console.log;
}

const configList = {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_TYPE,
    logging: logging,
    migrationStorage,
    migrationStorageTableName,
    seederStorage,
    seederStorageTableName,
    pool: {
        max: poolMax,
        min: poolMin,
        acquire: poolAcquire,
        idle: poolIdle,
    },
};

module.exports = {
    development: configList,
    test: configList,
    production: configList,
};

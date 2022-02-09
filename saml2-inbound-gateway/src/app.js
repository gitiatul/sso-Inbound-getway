const express = require("express");
const session = require("express-session");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const rfs = require("rotating-file-stream");
const { logHelpers, responseHelpers } = require("./helpers");
const passport = require("passport");
const MySQLStore = require("express-mysql-session")(session);

var app = express();

var routerMain = require("./routes");

const DEV_ENV = process.env.NODE_ENV || "development";

var sess = {
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: {},
};

/**
 * Custom log format for morgan
 */
let logFormat =
    ":remote-addr - :remote-user [:date[clf]] :method :url HTTP/:http-version :status :res[content-length] :response-time ms :referrer :user-agent";

// Disable unnecessary headers
app.disable("etag");
app.disable("x-powered-by");

// using bodyParser to parse JSON bodies into JS objects
app.use(express.json({ limit: "50mb" }));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// enabling CORS for all requests
app.use(cors({ credentials: true, origin: true }));
// app.use(
//     cors({
//         origin: "*",
//     })
// );

if (DEV_ENV != "production") {
    // adding Helmet to enhance your API's security
    app.use(
        helmet({
            frameguard: false,
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    "default-src": [
                        "'self'",
                        "localhost",
                        "cdnjs.cloudflare.com",
                        "*.amazonaws.com",
                    ],
                    "img-src": [
                        "'self'",
                        "localhost",
                        "data:",
                        "*.amazonaws.com",
                    ],
                    "script-src": [
                        "'self'",
                        "localhost",
                        "'unsafe-inline'",
                        "cdnjs.cloudflare.com",
                        "*.amazonaws.com",
                    ],
                    "style-src": [
                        "'self'",
                        "localhost",
                        "'unsafe-inline'",
                        "cdnjs.cloudflare.com",
                        "*.amazonaws.com",
                    ],
                    "frame-src": ["'self'", "localhost"],
                },
            },
        })
    );

    // adding morgan to log all HTTP requests in console
    app.use(morgan(logFormat));
}

if (DEV_ENV == "production") {
    app.set("trust proxy", 1); // trust first proxy
    sess.cookie.maxAge = 60000; // set maximum age for cookies
    sess.cookie.secure = true; // serve secure cookies

    // check /logs folder exists, if not, create one
    if (!fs.existsSync("logs")) {
        fs.mkdirSync("logs");
        logHelpers.logMessage("/logs does not exist\n/logs created");
    }
    /**
     * create a rotating write stream
     */
    let accessLogStream = rfs.createStream(logHelpers.generator, {
        path: path.join(__dirname, "../logs"),
        size: process.env.LOGGER_SIZE,
        maxSize: process.env.LOGGER_MAX_SIZE,
        interval: process.env.LOGGER_INTERVAL,
        compress: true,
    });
    // adding morgan to log all HTTP requests with status 4XX or 5XX in console
    app.use(
        morgan(logFormat, {
            skip: function (req, res) {
                return res.statusCode < 400;
            },
        })
    );
    // adding morgan to log all HTTP requests in logs/access.log file
    app.use(morgan(logFormat, { stream: accessLogStream }));

    // adding Helmet to enhance your API's security
    app.use(
        helmet({
            frameguard: false,
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    "default-src": [
                        "'self'",
                        "cdnjs.cloudflare.com",
                        "*.amazonaws.com",
                    ],
                    "img-src": ["'self'", "data:", "*.amazonaws.com"],
                    "script-src": [
                        "'self'",
                        "'unsafe-inline'",
                        "cdnjs.cloudflare.com",
                        "*.amazonaws.com",
                    ],
                    "style-src": [
                        "'self'",
                        "'unsafe-inline'",
                        "cdnjs.cloudflare.com",
                        "*.amazonaws.com",
                    ],
                    "frame-src": ["'self'", "*.amazonaws.com"],
                },
            },
        })
    );

    // Configure session store to mysql database
    let options = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        clearExpired: true,
        checkExpirationInterval: 900000,
        expiration: 86400000,
        createDatabaseTable: true,
        connectionLimit: 1,
        endConnectionOnClose: true,
        schema: {
            tableName: "express_sessions",
            columnNames: {
                session_id: "session_id",
                expires: "expires",
                data: "data",
            },
        },
    };
    let sessionStore = new MySQLStore(options);
    sess.store = sessionStore;
}

app.use(session(sess));

// passport: initialize
app.use(passport.initialize());
// passport: persistent login sessions
app.use(passport.session());

// require passport functions
require("./config/passport");

// set the view engine to ejs
app.set("views", "./src/views"); // specify the views directory
app.set("view engine", "ejs");

app.use("/", routerMain);

app.use((req, res, next) => {
    const err = new Error(process.env.ERR_404);
    err.status = 404;
    next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    let errCode = err.status || 501;
    return responseHelpers.generateApiResponse(
        res,
        req,
        err.message,
        errCode,
        err
    );
});

module.exports = app;

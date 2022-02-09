# KPI NINJA SSO SMART Inbound Gateway 👋

![Version](https://img.shields.io/badge/version-4.0.0-blue.svg?cacheSeconds=2592000 "Version")
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://kpininja.com)
[![License](https://img.shields.io/badge/license-KPI%20NINJA-%236437FF)](https://kpininja.com)

KPI Ninja SSO SMART Inbound Gateway is built following Serverless architecture. The current implementation is based on AWS Lambda and Serverless framework

The project uses following AWS services:

1. AWS Lambda
2. AWS API Gateway

## 🏠 [Homepage](https://kpininja.com/)

## For Local or Development environment

### Install all dependencies

```sh
$ npm install
# or
$ npm i
# or
$ yarn install
```

### Need to add/update following environment variables in `.env` file inside root directory. If file doesnot exist, create one. You can also use `.env.example` file or following snippet

```sh
## Application Configuration
NODE_ENV="development"

GATEWAY_URL="http://localhost:5005/dev"

## Database Configuration
DB_TYPE="mysql"
DB_HOST="localhost"
DB_PORT=3306
DB_NAME="kpi_sso_inbound"
DB_USER="root"
DB_PASS=""

DB_MAX_CON=10
DB_MIN_CON=0
DB_ACQUIRE_TIMEOUT=30000
DB_IDLE_TIMEOUT=10000

## KPI Configuration
KPI_FAVICON="https://universe-prod-kpininja-s3.s3.amazonaws.com/universe_logo/kpininja-favicon.png"
KPI_LOGO="https://universe-prod-kpininja-s3.s3.amazonaws.com/universe_logo/kpiNinja.png"
ADMIN_USERNAME=""
ADMIN_PASSWORD=""
API_LOGIN_ENDPOINT=""
APP_DETAIL_ENDPOINT=""
APP_LOGIN_ENDPOINT=""
```

### Update env according to server details such as GATEWAY_URL, database credentials, KPI Configurations, etc

### To run database migration, Go to directory & run following command

(Please note that, this command will delete all tables in database & create new tables according to schemas defined in migration.)

```sh
$ npm run migrate
# or
$ yarn migrate
```

### Start app in local / development environment

(Please note that, for app to start in local / development environment, `serverless-offline` plugin is used. Its configuration will be imported from `serverless.yml` file)

```sh
$ npm run dev
# or
$ yarn dev
```

### Application will start at GATEWAY_URL configured in `.env` file

### For SMART-on-FHIR based EHR / Tenant

Launch Endpoint: `<GATEWAY_URL>/launch?apptoken=<App_Token>&iss=<EHR_ISS_Endpoint>&launch=<Launch_Token>`

Redirect Endpoint: `<GATEWAY_URL>/callback`

### For non SMART-on-FHIR based EHR / Tenant

Launch Endpoint: `<GATEWAY_URL>/launch?apptoken=<App_Token>&iss=preshared&launch=preshared`

Redirect Endpoint: `<GATEWAY_URL>/callback`

## Copyright © 2021 [KPI Ninja](https://kpininja.com/)

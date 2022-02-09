# KPI Ninja SSO SMART Inbound Gateway 👋

![Version](https://img.shields.io/badge/version-4.0.0-blue.svg?cacheSeconds=2592000 "Version")
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://kpininja.com)
[![License](https://img.shields.io/badge/license-KPI%20NINJA-%236437FF)](https://kpininja.com)

KPI Ninja SSO SMART Inbound Gateway is built following Serverless architecture. The current implementation is based on AWS Lambda and Serverless framework

The project uses following AWS services:

1. AWS Lambda
2. AWS API Gateway

## 🏠 [Homepage](https://kpininja.com/)

## For Staging or Production environment

### Deploy code using AWS Lambda & AWS API Gateway

### To install required dependencies

```sh
$ npm install --production
# or
$ yarn install --production
```

### Add following environment variables in Lambda environment configuration with updated details for GATEWAY_URL, database credentials, KPI Configurations,etc

```sh
## Application Configuration
NODE_ENV="production"

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

### Configure environment variables according to server details such as GATEWAY_URL, database credentials, KPI Configurations, etc with lambda environment

### To create database schemas, export database dump from local / development environment & import into staging / production database server

### Configure AWS API Gateway for endpoints with its corresponding lambda functions as mentioned below

| HTTP Method   |      Endpoint      |  Corresponding Lambda Function |
|:--------------|:-------------------|:-------------------------------|
| GET           |  /                 | ./handler.index                |
| GET           |  /launch           | ./handler.launch               |
| GET           |  /callback         | ./handler.callback             |

### Application will start at GATEWAY_URL configured in environment settings

### For SMART-on-FHIR based EHR / Tenant

Launch Endpoint: `<GATEWAY_URL>/launch?apptoken=<App_Token>&iss=<EHR_ISS_Endpoint>&launch=<Launch_Token>`

Redirect Endpoint: `<GATEWAY_URL>/callback`

### For non SMART-on-FHIR based EHR / Tenant

Launch Endpoint: `<GATEWAY_URL>/launch?apptoken=<App_Token>&iss=preshared&launch=preshared`

Redirect Endpoint: `<GATEWAY_URL>/callback`

## Copyright © 2021 [KPI Ninja](https://kpininja.com/)

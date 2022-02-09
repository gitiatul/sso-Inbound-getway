# KPI Ninja SSO SAML2 Inbound Gateway 👋

![Version](https://img.shields.io/badge/version-5.0.0-blue.svg?cacheSeconds=2592000 "Version")
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://kpininja.com)
[![License](https://img.shields.io/badge/license-KPI%20NINJA-%236437FF)](https://kpininja.com)

## 🏠 [Homepage](https://kpininja.com/)

## For Staging or Production environment

### Go to web directory & run following command

```bash
$ git clone <Repo_url>
```

### To install dependencies for Staging or Production environment

```sh
$ npm install --production
# or
$ npm i --production
# or
$ yarn install --production
```

### For initial setup, Add / update following environment variables in `.env` file inside root directory. If file doesnot exist, create one. You can also use `.env.example` file or following snippet with updated details for `AWS_SECRET_NAME`, `AWS_SECRET_REGION`, `AWS_SECRET_FLAG`, etc. Rest of configuration will be fetched from `AWS Secrets Manager`

(Please note that, if `AWS_SECRET_FLAG` is set to `1`, `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY` are required.)

(Please note, `SSL_CRT_FILE` & `SSL_KEY_FILE` are used in local / development environment only if you want to run node server over `HTTPS`. Not recommended to use in production environment)

```sh
# ## Not required in production
# SSL_CRT_FILE=""
# ## Not required in production
# SSL_KEY_FILE=""
AWS_SECRET_NAME="kpi_saml_secrets_store"
AWS_SECRET_REGION="us-east-1"
AWS_SECRET_FLAG=0
# AWS_ACCESS_KEY_ID=""
# AWS_SECRET_ACCESS_KEY=""
```

### To setup database, import database dump provided in `dbdump` directory

### Start app in Staging or Production environment

```sh
$ npm start
# or
$ yarn start
```

### Application will start at `GATEWAY_URL` configured in AWS Secrets Manager

## Copyright © 2021 [KPI Ninja](https://kpininja.com/)

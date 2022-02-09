# KPI Ninja SSO SAML2 Inbound Gateway 👋

![Version](https://img.shields.io/badge/version-5.0.0-blue.svg?cacheSeconds=2592000 "Version")
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://kpininja.com)
[![License](https://img.shields.io/badge/license-KPI%20NINJA-%236437FF)](https://kpininja.com)

## 🏠 [Homepage](https://kpininja.com/)

## For Local or Development environment

### Go to web directory & run following command

```bash
$ git clone <Repo_url>
```

### Install all dependencies

```sh
$ npm install
# or
$ npm i
# or
$ yarn install
```

### For initial setup, we will need to add/update following environment variables in `.env` file inside root directory. If file doesnot exist, create one. You can also use `.env.example` file or following snippet. Rest of configuration will be fetched from `AWS Secrets Manager`

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

### Update env according to server details such as `AWS_SECRET_NAME`, `AWS_SECRET_REGION`, `AWS_SECRET_FLAG`, etc

(Please note that, if `AWS_SECRET_FLAG` is set to `1`, `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY` are required.)

(Please note, `SSL_CRT_FILE` & `SSL_KEY_FILE` are used in local / development environment only if you want to run node server over `HTTPS`.)

### To setup database, import database dump provided in `dbdump` directory

### Start app in local / development environment

```sh
$ npm run dev
# or
$ yarn dev
```

### Application will start at `GATEWAY_URL` configured in AWS Secrets Manager

## Copyright © 2021 [KPI Ninja](https://kpininja.com/)

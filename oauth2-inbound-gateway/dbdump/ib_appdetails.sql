-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 02, 2021 at 01:06 PM
-- Server version: 8.0.21
-- PHP Version: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kpi_sso_inbound`
--

-- --------------------------------------------------------

--
-- Table structure for table `ib_appdetails`
--

DROP TABLE IF EXISTS `ib_appdetails`;
CREATE TABLE IF NOT EXISTS `ib_appdetails` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app_token_id` text NOT NULL COMMENT 'Unique application token id generated in UUID4 format',
  `app_token` text NOT NULL COMMENT 'Unique application token issued by KPI',
  `kpi_access_token` text NOT NULL COMMENT 'API access token issued by KPI',
  `is_preshared` tinyint(1) DEFAULT NULL,
  `root_companies_id` bigint DEFAULT NULL,
  `client_id` text,
  `client_secret` text,
  `client_secret_type` varchar(50) DEFAULT 'request_header',
  `ehr_response` longtext,
  `iss` text,
  `authorization_endpoint` text,
  `token_endpoint` text,
  `audience_endpoint` text,
  `scope` text,
  `provider_fhir_id` text,
  `patient_fhir_id` text,
  `access_token` text,
  `access_token_expires_on` datetime DEFAULT NULL,
  `refresh_token` text,
  `id_token` text,
  `user_attr_location` varchar(50) DEFAULT 'token_response',
  `user_attr_mappings` text NOT NULL COMMENT 'Mappings of user attributes between KPI & IDP token.',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

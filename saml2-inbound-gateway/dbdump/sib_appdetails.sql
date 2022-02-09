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
-- Table structure for table `sib_appdetails`
--

DROP TABLE IF EXISTS `sib_appdetails`;
CREATE TABLE IF NOT EXISTS `sib_appdetails` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app_token_id` text NOT NULL COMMENT 'Unique application token id generated in UUID4 format',
  `app_token` text NOT NULL COMMENT 'Unique application token issued by KPI',
  `kpi_access_token` text NOT NULL COMMENT 'API access token issued by KPI',
  `root_companies_id` bigint DEFAULT NULL,
  `saml_endpoint` longtext,
  `saml_issuer` longtext,
  `saml_pub_cert` longtext COMMENT 'Public certificate of SAML IDP',
  `saml_attr_mappings` text NOT NULL COMMENT 'Mappings of SAML attributes between KPI & IDP saml assertion.',
  `saml_cert_sig_algo` longtext COMMENT 'Final EHR response received after successful authentication',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

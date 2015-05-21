-- phpMyAdmin SQL Dump
-- version 4.2.12deb2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 19, 2015 at 11:04 AM
-- Server version: 5.6.24-0ubuntu2
-- PHP Version: 5.6.4-4ubuntu6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `reputation`
--
CREATE DATABASE IF NOT EXISTS `reputation` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `reputation`;

-- --------------------------------------------------------

--
-- Table structure for table `additional_keywords`
--

CREATE TABLE IF NOT EXISTS `additional_keywords` (
`id` int(11) NOT NULL,
  `keyword` varchar(100) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `autocom_results`
--

CREATE TABLE IF NOT EXISTS `autocom_results` (
`id` int(11) NOT NULL,
  `content` text,
  `mood_score` double DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3307 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `keywords`
--

CREATE TABLE IF NOT EXISTS `keywords` (
`id` int(11) NOT NULL,
  `keyword` varchar(500) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE IF NOT EXISTS `product` (
`id` int(11) NOT NULL,
  `product` varchar(120) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `running_processes`
--

CREATE TABLE IF NOT EXISTS `running_processes` (
  `pid` int(11) NOT NULL,
  `script_name` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `scraped_tweets`
--

CREATE TABLE IF NOT EXISTS `scraped_tweets` (
`id` int(11) NOT NULL,
  `text` varchar(400) NOT NULL,
  `user` varchar(120) NOT NULL,
  `date` datetime NOT NULL,
  `mood_score` double DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=449 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE IF NOT EXISTS `settings` (
  `spider_depth` int(11) DEFAULT NULL,
  `page_limit` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sites_to_ignore`
--

CREATE TABLE IF NOT EXISTS `sites_to_ignore` (
`id` int(11) NOT NULL,
  `site` varchar(500) NOT NULL,
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `site_content`
--

CREATE TABLE IF NOT EXISTS `site_content` (
  `id` int(11) NOT NULL,
  `content` longtext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `spidered_links`
--

CREATE TABLE IF NOT EXISTS `spidered_links` (
`id` int(11) NOT NULL,
  `link` varchar(500) NOT NULL,
  `time_spidered` datetime DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `mood_score` double DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=250 DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `additional_keywords`
--
ALTER TABLE `additional_keywords`
 ADD PRIMARY KEY (`id`), ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `autocom_results`
--
ALTER TABLE `autocom_results`
 ADD PRIMARY KEY (`id`), ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `keywords`
--
ALTER TABLE `keywords`
 ADD PRIMARY KEY (`id`), ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `scraped_tweets`
--
ALTER TABLE `scraped_tweets`
 ADD PRIMARY KEY (`id`), ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `sites_to_ignore`
--
ALTER TABLE `sites_to_ignore`
 ADD PRIMARY KEY (`id`), ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `site_content`
--
ALTER TABLE `site_content`
 ADD KEY `id` (`id`);

--
-- Indexes for table `spidered_links`
--
ALTER TABLE `spidered_links`
 ADD PRIMARY KEY (`id`), ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `additional_keywords`
--
ALTER TABLE `additional_keywords`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `autocom_results`
--
ALTER TABLE `autocom_results`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3307;
--
-- AUTO_INCREMENT for table `keywords`
--
ALTER TABLE `keywords`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `scraped_tweets`
--
ALTER TABLE `scraped_tweets`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=449;
--
-- AUTO_INCREMENT for table `sites_to_ignore`
--
ALTER TABLE `sites_to_ignore`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `spidered_links`
--
ALTER TABLE `spidered_links`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=250;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `additional_keywords`
--
ALTER TABLE `additional_keywords`
ADD CONSTRAINT `additional_keywords_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `autocom_results`
--
ALTER TABLE `autocom_results`
ADD CONSTRAINT `autocom_results_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `keywords`
--
ALTER TABLE `keywords`
ADD CONSTRAINT `keywords_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `scraped_tweets`
--
ALTER TABLE `scraped_tweets`
ADD CONSTRAINT `scraped_tweets_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `sites_to_ignore`
--
ALTER TABLE `sites_to_ignore`
ADD CONSTRAINT `sites_to_ignore_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `site_content`
--
ALTER TABLE `site_content`
ADD CONSTRAINT `site_content_ibfk_1` FOREIGN KEY (`id`) REFERENCES `spidered_links` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `spidered_links`
--
ALTER TABLE `spidered_links`
ADD CONSTRAINT `spidered_links_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

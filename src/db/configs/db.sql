-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 25, 2021 at 04:32 AM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


--
-- Database: `gdplyr`
--

-- --------------------------------------------------------

--
-- Table structure for table `ads`
--

CREATE TABLE `ads` (
  `id` int(5) NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(25) DEFAULT NULL,
  `code` text DEFAULT NULL,
  `xml_file` varchar(255) NOT NULL,
  `start_offset` bigint(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ads`
--

-- --------------------------------------------------------

--
-- Table structure for table `alt_links`
--

CREATE TABLE `alt_links` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `link` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `data` text DEFAULT NULL,
  `status` tinyint(4) DEFAULT 0,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `_order` tinyint(4) DEFAULT 0,
  `deleted` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `backup_drives`
--

CREATE TABLE `backup_drives` (
  `id` int(11) NOT NULL,
  `link_id` int(11) NOT NULL,
  `acc_id` int(11) NOT NULL,
  `file_id` varchar(255) NOT NULL,
  `status` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `drive_auth`
--

CREATE TABLE `drive_auth` (
  `id` int(11) NOT NULL,
  `client_id` varchar(255) NOT NULL,
  `client_secret` varchar(255) NOT NULL,
  `refresh_token` varchar(255) NOT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `status` tinyint(4) DEFAULT 0 COMMENT '0 = active, 1 = failed',
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `hls_links`
--

CREATE TABLE `hls_links` (
  `id` int(11) NOT NULL,
  `link_id` int(11) NOT NULL,
  `server_id` int(11) NOT NULL,
  `file_id` varchar(255) NOT NULL,
  `file_size` text NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `links`
--

CREATE TABLE `links` (
  `id` int(11) NOT NULL,
  `acc_id` int(11) DEFAULT 0,
  `title` varchar(255) DEFAULT NULL,
  `main_link` text NOT NULL,
  `alt_link` varchar(255) DEFAULT NULL,
  `preview_img` varchar(255) DEFAULT NULL,
  `data` text DEFAULT NULL,
  `type` varchar(50) DEFAULT 'direct',
  `subtitles` text DEFAULT NULL,
  `views` int(11) DEFAULT 0,
  `downloads` int(25) DEFAULT 0,
  `is_alt` tinyint(4) DEFAULT 0,
  `slug` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT 'active',
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `servers`
--

CREATE TABLE `servers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `domain` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'stream',
  `playbacks` int(11) DEFAULT 0,
  `is_broken` tinyint(4) DEFAULT 0,
  `status` int(11) DEFAULT 1 COMMENT '0 = active,\r\n1 = inactive',
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `ads`
--

CREATE TABLE `popups` (
  `id` int(5) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `link` varchar(255) NOT NULL,
  `start_offset` bigint(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `config` varchar(50) NOT NULL,
  `var` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `role` varchar(100) NOT NULL,
  `status` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



--
-- Table structure for table `p2p_stats`
--

CREATE TABLE `p2p_stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `upload` int(11) NOT NULL,
  `download` int(11) NOT NULL,
  `peers` int(11) NOT NULL,
  `ipAddress` varchar(255) NOT NULL,
  `country`varchar(255) NOT NULL,
  `device` varchar(255) NOT NULL,
  `date` DATE NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Indexes for dumped tables
--

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`config`, `var`) VALUES
('version', '2.2'),
('proxyUser', ''),
('proxyPass', ''),
('timezone', 'Asia/Colombo'),
('dark_theme', '0'),
('adminId', '1'),
('sublist', '[\"sinhala\",\"english\",\"hindi\",\"french\",\"korean\"]'),
('logo', '../static/icons/logo.png'),
('favicon', '../static/icons/favicon.ico'),
('player', 'jwplayer'),
('playerSlug', 'v'),
('showServers', '1'),
('default_video', 'http://localhost/gdplyr/uploads/no-video.mp4'),
('default_banner', 'http://localhost/gdplyr/uploads/default-banner.jpg'),
('stun_servers', 'stun:stun.l.google.com:19302,stun:global.stun.twilio.com:3478?transport=udp'),
('tracker_servers', 'wss://personal.tracker1.com,wss://personal.tracker2.com'),
('last_backup', '2021-01-17 18:53:08'),
('jw_license', 'https://content.jwplatform.com/libraries/Jq6HIbgz.js'),
('isAdblocker', '1'),
('v_preloader', '1'),
('driveAccounts', '[]'),
('driveUploadChunk', '1'),
('isAutoBackup', '0'),
('disabledQualities', '[\"1080\"]'),
('isAutoEnableSub', '1'),
('autoPlay', '0'),
('streamRand', '1'),
('altR', '{\"onedrive\":{\"n\":\"\"},\"okru\":{\"n\":\"\"},\"gphoto\":{\"n\":\"\"},\"direct\":{\"n\":\"\"}}'),
('isActivated', '1'),
('acceptedDomains', 'http://localhost:3000'),
('drm', '0'),
('rateLimit', '10'),
('hlsSegmentName', 'ts'),
('m3u8Name', 'm3u8'),
('allowCaptcha', '1');

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `img`, `role`, `status`) VALUES
(29, 'admin', '$2y$10$zh4Jfuol7MOelfOWwoOUtu.3D/vfr1ROZdonfcblW2Sl7pC3.Gd0m', 'profile-img-codyseller.jpg', 'admin', 0);

--
-- Indexes for table `ads`
--
ALTER TABLE `ads`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `alt_links`
--
ALTER TABLE `alt_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `backup_drives`
--
ALTER TABLE `backup_drives`
  ADD PRIMARY KEY (`id`),
  ADD KEY `link_id` (`link_id`);

--
-- Indexes for table `drive_auth`
--
ALTER TABLE `drive_auth`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hls_links`
--
ALTER TABLE `hls_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `link_id` (`link_id`),
  ADD KEY `server_id` (`server_id`);

--
-- Indexes for table `links`
--
ALTER TABLE `links`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `popup ads`
--
ALTER TABLE `popups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `servers`
--
ALTER TABLE `servers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ads`
--
ALTER TABLE `ads`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `alt_links`
--
ALTER TABLE `alt_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `backup_drives`
--
ALTER TABLE `backup_drives`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `drive_auth`
--
ALTER TABLE `drive_auth`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT for table `hls_links`
--
ALTER TABLE `hls_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `links`
--
ALTER TABLE `links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=317;

--
-- AUTO_INCREMENT for table `ads`
--
ALTER TABLE `popups`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `servers`
--
ALTER TABLE `servers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alt_links`
--
ALTER TABLE `alt_links`
  ADD CONSTRAINT `alt_links_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `links` (`id`);

--
-- Constraints for table `backup_drives`
--
ALTER TABLE `backup_drives`
  ADD CONSTRAINT `backup_drives_ibfk_1` FOREIGN KEY (`link_id`) REFERENCES `links` (`id`);

--
-- Constraints for table `hls_links`
--
ALTER TABLE `hls_links`
  ADD CONSTRAINT `hls_links_ibfk_1` FOREIGN KEY (`link_id`) REFERENCES `links` (`id`),
  ADD CONSTRAINT `hls_links_ibfk_2` FOREIGN KEY (`server_id`) REFERENCES `servers` (`id`);
COMMIT;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 05, 2025 at 10:32 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lc-maintenance-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `borrowed_items`
--

CREATE TABLE `borrowed_items` (
  `id` int(11) NOT NULL,
  `borrower_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `item_name` text NOT NULL,
  `description` text DEFAULT NULL,
  `borrow_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `returned_date` timestamp NULL DEFAULT NULL,
  `assisted_by` varchar(100) DEFAULT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `borrowed_items`
--

INSERT INTO `borrowed_items` (`id`, `borrower_name`, `email`, `department`, `item_name`, `description`, `borrow_date`, `returned_date`, `assisted_by`, `status`, `created_at`) VALUES
(1, 'test', 'test@gmail.com', 'SDI', 'EUS Laptop1 w/charger, test (x1)', 'test', '2025-09-05 03:53:03', '2025-09-05 07:39:54', 'Angelo Cabase', 'Returned', '2025-09-05 03:53:03'),
(2, 'test', 'test@gmail.com', 'GenEd', 'EUS Laptop1 w/charger, test (x1)', 'tsadasda', '2025-09-05 04:00:55', '2025-09-05 07:41:28', 'Angelo Cabase', 'Returned', '2025-09-05 04:00:55');

-- --------------------------------------------------------

--
-- Table structure for table `chatbot_conversations`
--

CREATE TABLE `chatbot_conversations` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `started_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ended_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chatbot_messages`
--

CREATE TABLE `chatbot_messages` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) DEFAULT NULL,
  `sender` enum('user','bot') NOT NULL,
  `text` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `notified` tinyint(1) DEFAULT 0,
  `is_personal` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_modified` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `notified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `user_id`, `event_name`, `start_datetime`, `end_datetime`, `notified`, `is_personal`, `created_at`, `last_modified`, `notified_at`) VALUES
(1, 1, 'Flag Ceremony', '2025-09-02 08:00:00', '2025-09-03 09:30:00', 1, 1, '2025-04-20 09:31:09', '2025-09-02 06:05:21', NULL),
(2, 1, 'Afternoon Session', '2025-04-23 13:00:00', '2025-04-23 16:00:00', 0, 1, '2025-04-20 09:32:45', '2025-04-20 10:27:33', NULL),
(3, 2, 'Flag Raising Ceremony', '2025-04-21 08:30:00', '2025-04-21 09:30:00', 1, 0, '2025-04-20 09:58:00', '2025-04-20 10:27:33', NULL),
(4, 2, 'Afternoon Session', '2025-04-22 16:00:00', '2025-04-22 18:00:00', 0, 1, '2025-04-20 10:00:17', '2025-04-20 10:27:33', NULL),
(5, 2, 'test', '2025-04-23 01:00:00', '2025-04-23 13:00:00', 0, 0, '2025-04-20 10:09:26', '2025-04-20 10:33:23', NULL),
(6, 1, 'Testing sound system', '2025-04-22 14:00:00', '2025-04-22 16:00:00', 0, 1, '2025-04-20 10:16:23', '2025-04-20 10:27:33', NULL),
(7, 1, 'Testing new sound system', '2025-04-21 14:00:00', '2025-04-21 15:00:00', 1, 0, '2025-04-20 10:18:41', '2025-04-20 10:28:33', NULL),
(8, 1, 'Testing New Tv', '2025-04-21 13:00:00', '2025-04-21 14:00:00', 1, 0, '2025-04-20 10:19:40', '2025-04-20 10:27:33', NULL),
(9, 2, 'Testing TV', '2025-04-21 13:00:00', '2025-04-21 14:00:00', 1, 0, '2025-04-20 10:29:19', '2025-04-20 10:29:43', '2025-04-20 10:29:43'),
(10, 1, 'Demo ', '2025-04-21 14:00:00', '2025-04-21 15:00:00', 1, 0, '2025-04-20 10:31:58', '2025-04-20 10:32:18', '2025-04-20 10:32:18'),
(11, 1, 'Test', '2025-09-02 10:00:00', '2025-09-02 11:00:00', 1, 0, '2025-09-01 06:54:14', '2025-09-01 06:54:15', '2025-09-01 06:54:15'),
(12, 1, 'test', '2025-09-05 14:00:00', '2025-09-05 16:20:00', 1, 1, '2025-09-05 05:38:41', '2025-09-05 05:39:02', '2025-09-05 05:39:02');

-- --------------------------------------------------------

--
-- Table structure for table `event_preparations`
--

CREATE TABLE `event_preparations` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_preparations`
--

INSERT INTO `event_preparations` (`id`, `event_id`, `item_name`, `quantity`) VALUES
(16, 2, 'Speaker', 1),
(17, 2, 'Laptop', 1),
(18, 2, 'Mouse', 1),
(22, 1, 'Speaker', 1),
(23, 1, 'Mic', 1),
(24, 1, 'Laptop', 1),
(27, 3, 'Mic', 1),
(28, 3, 'Laptop', 1),
(32, 4, 'Speaker', 1),
(33, 6, 'Speaker', 1),
(34, 6, 'Mic', 1),
(35, 6, 'Laptop', 1),
(40, 8, 'TV', 5),
(44, 7, 'Speaker', 1),
(45, 7, 'Mic', 1),
(46, 7, 'Laptops', 4),
(48, 9, 'TV', 2),
(51, 10, 'Laptop', 1),
(52, 10, 'Mouse', 1),
(53, 11, 'Test', 1),
(54, 11, 'Test', 1);

-- --------------------------------------------------------

--
-- Table structure for table `inventory_items`
--

CREATE TABLE `inventory_items` (
  `id` int(11) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `status` enum('New','Used','Old','Restored') DEFAULT 'Used',
  `serial_number` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_items`
--

INSERT INTO `inventory_items` (`id`, `item_name`, `category`, `quantity`, `status`, `serial_number`, `created_at`, `updated_at`) VALUES
(1, 'Item 1', 'Item 1', 51, 'New', '', '2025-04-18 00:50:34', '2025-04-19 14:44:06'),
(2, 'Item 1', 'Item 1', 5, 'Used', '1234567', '2025-04-18 00:50:51', '2025-04-18 04:52:37'),
(3, 'Item 1', 'Item 1', 5, 'Used', '123456', '2025-04-18 00:51:49', '2025-04-18 04:52:49'),
(4, 'Item 1', 'Item 1', 5, 'Old', '12345678911', '2025-04-18 00:52:53', '2025-04-19 14:44:00'),
(5, 'Item 2', 'Item 2', 1, 'Used', '1234521', '2025-04-18 01:06:24', '2025-04-19 12:08:53'),
(6, 'Item 7', 'Laptop', 1, 'Restored', '', '2025-04-18 23:03:24', '2025-04-19 13:09:45'),
(7, 'test', 'Laptop', 12, 'New', '111111111111111', '2025-04-19 03:53:09', '2025-04-19 12:00:21'),
(8, 'test', 'Electronics', 1, 'Old', '1111', '2025-04-19 03:58:12', '2025-04-19 03:58:12'),
(9, 'test', 'Laptop', 2, 'Used', '111111111111111', '2025-04-19 04:03:20', '2025-04-19 09:42:24'),
(10, 'test', 'Networking', 2, 'New', '111111111111111', '2025-04-19 04:03:37', '2025-04-19 12:06:40'),
(11, 'test', 'Computers', 1, 'Old', 'aa', '2025-04-19 04:05:14', '2025-04-19 04:29:54'),
(12, 'test 2', 'Monitors', 1, 'Old', 'aa', '2025-04-19 04:05:27', '2025-04-19 04:05:27'),
(13, 'test 21', 'Furniture', 1, 'Used', 'aa', '2025-04-19 04:05:45', '2025-04-19 13:09:26'),
(14, 'tes', 'Monitors', 132, 'Used', '1212121', '2025-09-02 08:03:37', '2025-09-02 08:03:37');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `message`, `created_at`) VALUES
(1, 'New Report', 'A new report has been submitted at Test Notif.', '2025-09-05 10:24:35'),
(2, 'Report Update', 'Your report #27 has been updated. New status: In Progress, Priority: Low.', '2025-09-05 10:28:16'),
(3, 'Report Update', 'Your report #27 has been updated. New status: Resolved, Priority: Low.', '2025-09-05 10:30:24'),
(4, 'Report Update', 'Your report about Test Notif has been updated. New status: In Progress, Priority: Low.', '2025-09-05 10:32:12'),
(5, 'Report Update', 'Your report about Test Notif has been updated. New status: Resolved, Priority: Low.', '2025-09-05 10:35:15'),
(6, 'Report Update', 'Your report about Test Notif has been updated. New status: In Progress, Priority: Low.', '2025-09-05 10:37:16'),
(7, 'Report Update', 'Your report about Test Notif has been updated. New status: Resolved, Priority: Low.', '2025-09-05 10:37:31'),
(8, 'Report Update', 'Your report about Test Notif is now being worked on (In Progress).', '2025-09-05 10:40:11'),
(9, 'Report Update', 'Your report about Test Notif has been set back to Pending.', '2025-09-05 10:40:30'),
(10, 'Report Update', 'Your report about Test Notif has been marked as Resolved.', '2025-09-05 10:40:40'),
(11, 'Report Update', 'Your report about Test Notif is now being worked on (In Progress).', '2025-09-05 10:40:50'),
(12, 'Report Update', 'Your report about Test Notif has been marked as Resolved.', '2025-09-05 10:42:02'),
(13, 'Report Update', 'Your report about Test Notif is now being worked on (In Progress).', '2025-09-05 10:42:12'),
(14, 'Report Update', 'Your report about Test Notif has been marked as Resolved.', '2025-09-05 10:44:35'),
(15, 'Report Update', 'Your report about Test Notif has been reopened and is back to In Progress.', '2025-09-05 10:44:45'),
(16, 'Report Update', 'Your report about Test Notif has been set back to Pending.', '2025-09-05 10:44:59'),
(17, 'Report Update', 'Your report about Test Notif has been marked as Resolved.', '2025-09-05 10:45:06'),
(18, 'Report Update', 'Your report about Test Notif has been set back to Pending.', '2025-09-05 10:45:14'),
(19, 'New Report', 'A new report has been submitted about Library.', '2025-09-05 10:46:49'),
(20, 'Report Update', 'Your report about Library is now being worked on (In Progress).', '2025-09-05 10:47:12'),
(21, 'Report Update', 'Your report about Library has been marked as Resolved.', '2025-09-05 10:47:40'),
(22, 'Report Update', 'Your report about Test Notif has been marked as Resolved.', '2025-09-05 10:47:43'),
(23, 'Report Update', 'Your report about Test Image Input Reset has been marked as Resolved.', '2025-09-05 10:47:52'),
(24, 'Report Update', 'Your report about test has been marked as Resolved.', '2025-09-05 10:47:58'),
(25, 'Report Update', 'Your report about Test 2 has been marked as Resolved.', '2025-09-05 10:48:01'),
(26, 'Report Update', 'Your report about Library has been reopened and is back to In Progress.', '2025-09-05 10:48:33'),
(27, 'Report Update', 'Your report about Library has been set back to Pending.', '2025-09-05 10:59:38'),
(28, 'Report Update', 'Your report about Test is now being worked on (In Progress).', '2025-09-05 11:01:02'),
(29, 'Public Events', 'Upcoming Events:\n\n- test\n  From: 9/5/2025, 2:00:00 PM\n  To:   9/5/2025, 4:20:00 PM', '2025-09-05 13:38:42'),
(30, 'Your Personal Events', 'You have 1 personal event(s) coming up:\n\n- test\n  From: 9/5/2025, 2:00:00 PM\n  To:   9/5/2025, 4:20:00 PM', '2025-09-05 13:39:02'),
(31, 'Report Archived', 'Your report about Test Success Modal 2 has been archived.', '2025-09-05 13:54:51'),
(32, 'New Report', 'A new report has been submitted about Test.', '2025-09-05 14:05:04');

-- --------------------------------------------------------

--
-- Table structure for table `notification_receivers`
--

CREATE TABLE `notification_receivers` (
  `id` int(11) NOT NULL,
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification_receivers`
--

INSERT INTO `notification_receivers` (`id`, `notification_id`, `user_id`, `is_read`, `read_at`) VALUES
(1, 1, 1, 1, NULL),
(2, 1, 3, 1, NULL),
(3, 1, 4, 0, NULL),
(4, 1, 8, 0, NULL),
(5, 2, 2, 1, NULL),
(6, 3, 2, 0, NULL),
(7, 4, 2, 1, NULL),
(8, 5, 2, 0, NULL),
(9, 6, 2, 0, NULL),
(10, 7, 2, 0, NULL),
(11, 8, 2, 1, NULL),
(12, 9, 2, 1, NULL),
(13, 10, 2, 1, NULL),
(14, 11, 2, 1, NULL),
(15, 12, 2, 1, NULL),
(16, 13, 2, 0, NULL),
(17, 14, 2, 0, NULL),
(18, 15, 2, 1, NULL),
(19, 16, 2, 0, NULL),
(20, 17, 2, 0, NULL),
(21, 18, 2, 0, NULL),
(22, 19, 1, 0, NULL),
(23, 19, 3, 0, NULL),
(24, 19, 4, 0, NULL),
(25, 19, 8, 0, NULL),
(26, 20, 2, 1, NULL),
(27, 21, 2, 0, NULL),
(28, 22, 2, 0, NULL),
(29, 23, 2, 1, NULL),
(30, 24, 2, 0, NULL),
(31, 25, 1, 1, NULL),
(32, 26, 2, 1, NULL),
(33, 27, 2, 1, NULL),
(34, 28, 3, 0, NULL),
(35, 29, 1, 0, NULL),
(36, 29, 3, 0, NULL),
(37, 29, 4, 0, NULL),
(38, 29, 8, 0, NULL),
(39, 30, 1, 0, NULL),
(40, 31, 2, 1, NULL),
(41, 32, 1, 0, NULL),
(42, 32, 3, 0, NULL),
(43, 32, 4, 0, NULL),
(44, 32, 8, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_reports`
--

CREATE TABLE `tbl_reports` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `location` varchar(255) NOT NULL,
  `report_type` varchar(100) NOT NULL,
  `issue_type` enum('Electrical','Plumbing','Cleaning','General Repair','Others') NOT NULL DEFAULT 'Others',
  `description` text NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `priority` text NOT NULL DEFAULT 'Medium',
  `status` enum('Pending','In Progress','Resolved') DEFAULT 'Pending',
  `is_anonymous` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archived` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_reports`
--

INSERT INTO `tbl_reports` (`id`, `user_id`, `location`, `report_type`, `issue_type`, `description`, `image_path`, `priority`, `status`, `is_anonymous`, `created_at`, `updated_at`, `archived`) VALUES
(1, 1, 'Test', '', 'Others', 'Test', NULL, 'Medium', 'Pending', 0, '2025-09-02 07:25:52', '2025-09-04 06:53:26', 1),
(2, 1, 'Test 2', '', 'Plumbing', 'Test 2', NULL, 'High', 'Resolved', 0, '2025-09-02 07:26:12', '2025-09-05 02:48:01', 0),
(4, 2, 'test', '', 'General Repair', 'test', NULL, 'Urgent', 'Resolved', 0, '2025-09-03 00:58:24', '2025-09-05 02:47:58', 0),
(5, 2, 'hello world', '', 'Others', 'hello world', NULL, 'Medium', '', 0, '2025-09-03 00:59:34', '2025-09-04 04:47:25', 1),
(6, 2, 'hello world 2', '', 'Others', 'hello world 2', NULL, 'Medium', 'Pending', 0, '2025-09-03 01:01:49', '2025-09-04 04:16:43', 1),
(7, 2, 'hello world 3', '', 'Others', 'hello world 3', NULL, 'Medium', 'Pending', 0, '2025-09-03 01:02:28', '2025-09-04 04:16:26', 1),
(8, 2, 'Test', '', 'Others', 'Test', '1756861823791.jpg', 'Medium', 'Pending', 0, '2025-09-03 01:10:23', '2025-09-04 04:12:19', 1),
(9, 2, 'test', '', 'Others', 'test', NULL, 'Medium', 'Pending', 0, '2025-09-03 01:11:54', '2025-09-04 04:11:22', 1),
(10, 2, 'test', '', 'Others', 'test', '1756862613343.jpg', 'Medium', 'Pending', 0, '2025-09-03 01:23:33', '2025-09-04 04:11:15', 1),
(11, 2, 'test input', '', 'Others', 'test input', '1756862697998.jpg', 'Medium', 'Pending', 0, '2025-09-03 01:24:58', '2025-09-04 04:09:55', 1),
(12, 2, 'Test Input 6', '', 'Others', 'Test Input 6', NULL, 'Medium', 'Pending', 0, '2025-09-03 02:03:09', '2025-09-04 02:59:44', 0),
(13, 2, 'Test', '', 'Cleaning', 'test', NULL, 'Medium', 'Pending', 0, '2025-09-03 02:51:02', '2025-09-04 04:58:02', 0),
(14, 2, 'Test success modal', '', 'Others', 'Test success modal', '1756869829173.jpg', 'Medium', 'Pending', 0, '2025-09-03 03:23:49', '2025-09-05 05:49:59', 1),
(15, 2, 'Test Success Modal 2', '', 'Others', 'Test Success Modal 2', NULL, 'Medium', 'Pending', 0, '2025-09-03 03:24:17', '2025-09-05 05:54:51', 1),
(16, 2, 'Test Image Input Reset', '', 'Others', 'Test Image Input Reset', '1756870065788.jpg', 'Medium', 'Resolved', 0, '2025-09-03 03:27:45', '2025-09-05 02:47:52', 0),
(17, 2, 'TEST ', '', 'Others', 'TEST', '1756870619447.jpg', 'Medium', 'Pending', 0, '2025-09-03 03:36:59', '2025-09-04 02:59:44', 0),
(20, 3, 'Test', '', 'Others', 'Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.Please fill out the details below to report any broken equipment, facility issue, or maintenance concern within the campus.', NULL, 'Urgent', 'In Progress', 0, '2025-09-03 06:53:45', '2025-09-05 03:01:02', 0),
(21, 1, 'Library', '', 'General Repair', 'Plumbing issue', '1756883971184.jpg', 'Low', 'Pending', 0, '2025-09-03 07:19:31', '2025-09-04 03:36:31', 0),
(22, 2, 'Test Reprot Type', '', 'Cleaning', 'Test Report Type', NULL, 'Urgent', 'Resolved', 0, '2025-09-04 02:55:24', '2025-09-04 03:43:08', 0),
(23, 2, 'Test IO', '', 'Plumbing', 'Test IO', NULL, 'Low', 'In Progress', 0, '2025-09-04 05:00:14', '2025-09-04 05:42:57', 0),
(24, 2, 'Test IO', '', 'Plumbing', 'Test IO', NULL, 'Low', 'Resolved', 0, '2025-09-04 05:01:02', '2025-09-04 05:09:24', 0),
(25, 1, 'Test', '', 'Others', 'Test', NULL, 'Low', 'In Progress', 0, '2025-09-05 01:42:53', '2025-09-05 01:42:53', 0),
(26, 1, 'Test 2', '', 'Others', 'Test 2', NULL, 'Medium', 'In Progress', 0, '2025-09-05 01:43:31', '2025-09-05 01:43:31', 0),
(27, 2, 'Test Notif', '', 'Electrical', 'Test Notif', '1757039075725.jpg', 'Low', 'Resolved', 0, '2025-09-05 02:24:35', '2025-09-05 02:47:43', 0),
(28, 2, 'Library', '', 'Cleaning', 'Scattered glass', NULL, 'Low', 'Pending', 0, '2025-09-05 02:46:49', '2025-09-05 02:59:38', 0),
(29, 3, 'Test', '', 'General Repair', 'Test', NULL, 'High', 'Pending', 0, '2025-09-05 06:05:04', '2025-09-05 06:06:12', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff','user') NOT NULL DEFAULT 'user',
  `image_url` text DEFAULT NULL,
  `token` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`id`, `name`, `email`, `password`, `role`, `image_url`, `token`, `status`, `created_at`) VALUES
(1, 'Angelo Cabase', 'gelocabase1324@gmail.com', '$2b$10$/Des5DS6YyWQx4gGyXRj0egG3wIbj4VfxzjwienlVNB1QgHmmeLta', 'admin', 'profile/1744338209565.jpg', '117007367720928788994', 1, '2025-03-05 09:20:12'),
(2, 'angelo cabase', 'goldengrape777@gmail.com', '$2b$10$X.X0amwzJRqHCFc9ft0JzuHjXLVjRIcIU2tr/QshcaD2oUhX7o5h2', 'user', 'profile/1744338228306.jpg', 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjI1ZjgyMTE3MTM3ODhiNjE0NTQ3NGI1MDI5YjAxNDFiZDViM2RlOWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1ODA1Njg3MjEwMTYtZjY5cWlxbzgyZGhsN3N1bG1zMWY1dWJyNTB0YnJmNmkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1ODA1Njg3MjEwMTYtaGFpNmkxdXBobXBlaDZqOW1vbTVpZjY2Nmg5dXY0MmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE1MjE5NDM4MzQ1MDU0MDM0MjgiLCJlbWFpbCI6ImdvbGRlbmdyYXBlNzc3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiYW5nZWxvIGNhYmFzZSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKT3hIenhTV3NFMlk5bFpibzNlaEpSdlhYZC1NZkNHM1hKcnJHY1pIalRtaUNiMGc9czk2LWMiLCJnaXZlbl9uYW1lIjoiYW5nZWxvIiwiZmFtaWx5X25hbWUiOiJjYWJhc2UiLCJpYXQiOjE3NDEyMjA5MjMsImV4cCI6MTc0MTIyNDUyM30.JkFjD2Slon2KIJREvqC7jria-SrBPwk_fny2-lQ00oSf-tC8dvy1SjYFp9qFExKJdGZWEUKuKvR_mzP8tjyAlAqT1w9Q3Q1W5MH76uNAApb-UtrnlzNLSvzebCBQ1U-cRX3uLf-x26UEIl09803QT5YfjUwHXW8hIcgwQwbZ5Qc6FLFWhMBKi3Qa_qkLylG0D-QrBaZ5lgRq_OaraMyiuOi9WCkN8Jz8_ufEjPuFAhowYQUW6il1P6rmohsLwuld9MXxru5CJxRz_LgHH3lLqO1gDzwzFlakrpdG5QvZxZeNbIuqdG9eSm2n8Q4BREXCseovEPjSme6sXfqiTALy7g', 1, '2025-03-05 09:20:45'),
(3, 'Unknow User', 'cabase.1324@gmail.com', '$2b$10$6vq89I1MianI.TD0AKq5KehsP/jA7mnWobvAngALORqF2Nyf46OVq', 'user', 'profile/1744338221459.jpg', 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjI1ZjgyMTE3MTM3ODhiNjE0NTQ3NGI1MDI5YjAxNDFiZDViM2RlOWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1ODA1Njg3MjEwMTYtZjY5cWlxbzgyZGhsN3N1bG1zMWY1dWJyNTB0YnJmNmkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1ODA1Njg3MjEwMTYtaGFpNmkxdXBobXBlaDZqOW1vbTVpZjY2Nmg5dXY0MmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTgxMTU5NDA5NzE4OTMyNDcyOTciLCJlbWFpbCI6ImNhYmFzZS4xMzI0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiVW5rbm93IFVzZXIiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSzZ1MTFJVVBkaWRhUEdOdFlsVEJramtMQ0wwcUI2YzlGQ0x1MHVpcjVGbWkxS1BBPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlVua25vdyIsImZhbWlseV9uYW1lIjoiVXNlciIsImlhdCI6MTc0MTIyNDc4NCwiZXhwIjoxNzQxMjI4Mzg0fQ.GxwsRhnYGhFbQIlW5IYSrPrBRnOcPZu6a_QcUKNuLkLUD47ewC2l2k5Cmf5PBmRzZaVI-rlJuU0Ba3ir27isOgm7Aw-HS3dM2zmDyxeTTcsp_GM4LJcqDnqQfY4lolbv9-T41xs-jgznJzwmkiurynmgAYTZtbuzMh6J9O1UDptdyAUiLq-Ae-czLr-mn_eFhb_0fum04bZvyo1IGJ6Z6TI5mVAvwTJn5gwGRyyD3xfN9f77QJ2UgrM6dVFAkuoNF2Wf2OjqXT18kycA64migkLtZr5c1KF7t3FmAW8YsAe7AQgRrtVcZUWtRCqiAG74xpyoCjhwhw8f4fxQILVLzw', 1, '2025-03-05 09:33:04'),
(4, 'Gelo cabase', 'silverlemon777@gmail.com', '$2b$10$/Des5DS6YyWQx4gGyXRj0egG3wIbj4VfxzjwienlVNB1QgHmmeLta', 'staff', 'profile/1744375756219.jpg', '115140714590763332758', 1, '2025-03-24 09:57:28'),
(5, 'Test', 'sample@gmail.com', '$2b$10$V9DqN307V36.0F3gY5waM.nMbi72T1R8FlWeOaLuzLjbjJuFlVTYK', 'user', NULL, '', 1, '2025-04-10 20:53:43'),
(6, 'Unknow User', 'goldenpaper777@gmail.com', '$2b$10$FuDKocDdf0o7vBv9xcsRl.haDD9Jt.owCbDaJ1cgVp5tTy/jxrBIi', 'user', 'profile/1744956399150.jpg', '108906153753455574585', 1, '2025-04-18 06:06:39'),
(8, '12345', 'sample2@gmail.com', '$2b$10$Xt7Wz2a1Zhv4rxjn0XozouRFKm5pFugmavv4d.5UZ2PUTbM9.4NUG', 'staff', NULL, '', 1, '2025-04-19 06:43:29'),
(10, 'test data', 'test@gmail.com', '$2b$10$ndcGCItTcg1e9QeZX00Tc.QvyVOVmya./FMgELR2vTWCWzmuQXgyu', 'user', NULL, '', 1, '2025-04-19 14:12:36'),
(11, 'test', 'test2@gmail.com', '$2b$10$aKCvBdx3Nc2RZfSmmBisAOvQ70Bs3WP9R7XlYrd/TWpR/vKOVMaKO', 'user', NULL, '', 1, '2025-04-19 14:12:53'),
(12, 'test', 'test3@gmail.com', '$2b$10$QOeaS4OU7ScOw9fjnXyqPOnY7sGyqlQw3LDnQwDWFJ7Ewb971O7Y2', 'user', NULL, '', 1, '2025-04-19 14:16:24'),
(13, 'Test 4', 'test4@gmail.com', '$2b$10$MipPAWp8DC7wxg2vNRcmeeog2f30QGbkdsO83m2S9/g4FG6Pe5pfq', 'user', NULL, '', 1, '2025-04-19 14:26:54'),
(14, 'Test 4', 'test5@gmail.com', '$2b$10$Rj1UKioYsULP.q6lOBlS1e7IaXJxEDbAF3B7EmDfRoyz5Fya4qovu', 'user', NULL, '', 1, '2025-04-19 14:28:47'),
(15, 'Unknown User', 'goldengarlic777@gmail.com', '', 'user', 'profile/1756946049558.jpg', '113577706637449188689', 1, '2025-09-04 00:34:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `borrowed_items`
--
ALTER TABLE `borrowed_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chatbot_conversations`
--
ALTER TABLE `chatbot_conversations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversation_id` (`conversation_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user` (`user_id`);

--
-- Indexes for table `event_preparations`
--
ALTER TABLE `event_preparations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `inventory_items`
--
ALTER TABLE `inventory_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification_receivers`
--
ALTER TABLE `notification_receivers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notification_id` (`notification_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tbl_reports`
--
ALTER TABLE `tbl_reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `borrowed_items`
--
ALTER TABLE `borrowed_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `chatbot_conversations`
--
ALTER TABLE `chatbot_conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `event_preparations`
--
ALTER TABLE `event_preparations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `inventory_items`
--
ALTER TABLE `inventory_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `notification_receivers`
--
ALTER TABLE `notification_receivers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `tbl_reports`
--
ALTER TABLE `tbl_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  ADD CONSTRAINT `chatbot_messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `chatbot_conversations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `event_preparations`
--
ALTER TABLE `event_preparations`
  ADD CONSTRAINT `event_preparations_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notification_receivers`
--
ALTER TABLE `notification_receivers`
  ADD CONSTRAINT `notification_receivers_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notifications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notification_receivers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

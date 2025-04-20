-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 20, 2025 at 01:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lc-its-db`
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
(1, 'Borrower 6', 'sample@gmail.com', 'Nursing', 'EUS Laptop1 w/charger (x1), EUS Laptop2 w/charger (x1), EUS Laptop3 w/charger (x1), EUS Laptop4 w/charger (x1)', 'A sample request', '2025-04-19 03:23:50', '2025-04-26 09:00:00', 'Angelo Cabase', 'Pending', '2025-04-17 14:36:51'),
(2, 'Borrower 2', 'Test@gmail.com', 'Therapy', 'EUS Laptop1 w/charger (x1), EUS Laptop2 w/charger (x1), EUS Laptop6 w/charger (x1), Test 1 (x1), Test 2 (x1), Test (x1)', 'Test 2', '2025-04-16 23:13:29', '2025-04-17 16:00:00', 'Angelo Cabase', 'Returned', '2025-04-17 14:53:17'),
(3, 'Borrower 3', 'test@gmail.com', 'FMO', 'EUS Laptop1 w/charger (x1), tssasadsa (x1), ssasdsad (x1), sdadadada (x1), sdadsadsa (x1), asdsasad (x1)', 'sadsadsadsa', '2025-04-19 05:26:32', '2025-04-29 16:00:00', 'Angelo Cabase', 'Returned', '2025-04-17 14:58:25'),
(4, 'Borrower 4', 'test@gmail.com', 'FMO', 'EUS Laptop1 w/charger (x1), Mouse (x1), Keyboard (x1), Speaker (x1), Extension (x1)', 'adsadsasdas', '2025-04-19 05:22:39', '2025-04-20 16:00:00', '', 'Returned', '2025-04-17 15:00:00'),
(5, 'Test 6', 'test@gmail.com', 'Clinic', 'EUS Laptop6 w/charger (x1), test 1 (x1), test 2 (x1)', 'test', '2025-04-17 07:13:42', '2025-04-17 16:00:00', '', 'Pending', '2025-04-17 15:04:07'),
(6, 'Borrower 5', 'test@gmail.com', 'Nursing', 'EUS Laptop1 w/charger (x1), EUS Laptop2 w/charger (x2)', 'test 6', '2025-04-12 23:13:48', '2025-04-18 09:00:00', 'Angelo Cabase', 'Pending', '2025-04-17 15:09:27'),
(7, 'Test 2', 'test@gmail.com', 'MLS', 'EUS Laptop1 w/charger (x1)', 'test', '2025-04-17 08:03:28', '2025-04-18 16:00:00', 'Angelo Cabase', 'Pending', '2025-04-17 16:03:28'),
(8, 'borrower 1', 'borrower1@gmail.com', 'GenEd', 'EUS Laptop1 w/charger, EUS Laptop3 w/charger, borrowed item 1 (x1), borrowed item 2 (x12)', 'Borrower 1', '2025-04-18 00:28:33', '2025-04-17 16:00:00', 'Angelo Cabase', 'Pending', '2025-04-18 00:28:33'),
(9, 'Name', 'Name@gmail.com', 'Nursing', 'EUS Laptop1 w/charger, EUS Laptop1 w/charger (x1), EUS Laptop1 w/charge 2 (x2), EUS Laptop1 w/charge 3 (x2), EUS Laptop1 w/charge 4 (x4)', 'For presentation', '2025-04-18 05:18:28', '2025-04-20 16:00:00', 'Angelo Cabase', 'Pending', '2025-04-18 05:18:28'),
(10, 'EUS Laptop2 w/charger', 'cabase.1324@gmail.com', 'Nursing', 'EUS Laptop1 w/charger (x1), EUS Laptop6 w/charger (x1)', 'EUS Laptop2 w/charger', '2025-04-19 05:44:33', '2025-04-20 16:00:00', 'Angelo Cabase', 'Approved', '2025-04-18 05:22:12'),
(11, 'w/charger', 'gelocabase1324@gmail.com', 'Nursing', 'EUS Laptop1 w/charger (x1), EUS Laptop6 w/charger (x1), EUS Laptop2 w/charger (x1), w/charger (x1)', 'w/charger', '2025-04-16 05:24:09', '2025-04-22 09:00:00', 'Angelo Cabase', 'Pending', '2025-04-18 05:24:09'),
(12, 'phTime', 'phTime@gmail.com', 'Respiratory', 'EUS Laptop1 w/charger (x1), EUS Laptop6 w/charger (x1), phTime (x1)', 'phTime', '2025-04-17 21:27:41', '2025-04-22 16:00:00', 'Angelo Cabase', 'Returned', '2025-04-18 05:27:41'),
(13, '19/04/2025', 'test@gmail.com', 'Rad Teck Pharmacy', 'EUS Laptop1 w/charger (x1), EUS Laptop6 w/charger (x1)', '19/04/2025 Saturday', '2025-04-19 05:26:35', '2025-04-18 16:00:00', 'Angelo Cabase', 'Returned', '2025-04-18 23:02:19'),
(14, '19/04/2025', '19/04/2025@gmail.com', 'GenEd', 'EUS Laptop1 w/charger (x1), EUS Laptop6 w/charger (x1)', '19/04/2025', '2025-04-19 05:53:43', '2025-04-19 09:00:00', 'Angelo Cabase', 'Returned', '2025-04-18 23:08:48'),
(15, '19/04/2025-2', '19/04/2025@gmail.com', 'Nursing', 'EUS Laptop1 w/charger, EUS Laptop3 w/charger, EUS Laptop5 w/charger, EUS Laptop2 w/charger, EUS Laptop4 w/charger, EUS Laptop6 w/charger, 19/04/2025 (x32), 19/04/2025 (x12), 23 (x2)', '19/04/2025', '2025-04-19 05:49:21', '2025-04-21 09:00:00', 'Angelo Cabase', 'Returned', '2025-04-18 23:10:08'),
(16, 'VITE_API_URL', 'VITE_API_URL@gmail.com', 'Therapy', 'EUS Laptop1 w/charger (x2), EUS Laptop3 w/charger (x1), EUS Laptop5 w/charger (x1), EUS Laptop2 w/charger (x1), EUS Laptop4 w/charger (x1), EUS Laptop6 w/charger (x1)', 'VITE_API_URL', '2025-04-18 13:27:14', '2025-04-21 09:00:00', 'Angelo Cabase', 'Returned', '2025-04-18 23:12:28'),
(17, 'VITE_API_URL', 'VITE_API_URL@gmail.com', 'Nursing', 'EUS Laptop1 w/charger (x1), EUS Laptop3 w/charger (x1), EUS Laptop5 w/charger (x1), VITE_API_URL (x1)', 'VITE_API_URL', '2025-04-18 15:15:20', '2025-04-18 16:00:00', 'Angelo Cabase', 'Pending', '2025-04-18 23:15:20'),
(18, 'test', 'VITE_API_URL@gmail.com', 'Physical Therapy', 'EUS Laptop1 w/charger (x1), EUS Laptop3 w/charger (x1)', 'VITE_API_URL', '2025-04-19 03:22:16', '2025-04-19 09:00:00', 'Angelo Cabase', 'Approved', '2025-04-18 23:16:43'),
(19, 'app.use', 'app.use@gmail.com', 'Respiratory', 'app.use (x1)', 'app.use', '2025-04-18 15:20:00', '2025-04-18 16:00:00', 'Angelo Cabase', 'Pending', '2025-04-18 23:20:00'),
(20, 'Requst ', 'request@gmail.com', 'MLS', 'EUS Laptop1 w/charger (x1), EUS Laptop2 w/charger (x1), EUS Laptop3 w/charger (x1), EUS Laptop4 w/charger (x1), EUS Laptop5 w/charger (x1), EUS Laptop6 w/charger (x1), const dateOnly (x1)', 'const dateOnly = new Date(formData.returned_date);\n', '2025-04-18 21:27:09', '2025-04-19 09:00:00', 'Angelo Cabase', 'Approved', '2025-04-18 23:53:24'),
(21, 'just simple', 'simple@gmail.com', 'Nursing', 'EUS Laptop1 w/charger', 'for presentation', '2025-04-19 05:49:05', '2025-04-21 09:00:00', 'Angelo Cabase', 'Returned', '2025-04-19 00:43:38'),
(22, 'Juan', 'Juan@gmail.com', 'Nursing', 'EUS Laptop1 w/charger (x1)', 'for presentation later at the room 101', '2025-04-18 17:08:58', '2025-04-18 09:00:00', 'Angelo Cabase', 'Pending', '2025-04-19 01:08:58'),
(23, 'Juan', 'juan@gmail.com', 'Nursing', 'EUS Laptop1 w/charger (x1)', 'I will use this equipment to prepare for my upcoming capstone defense, which requires access to specialized software and hardware.', '2025-04-18 21:49:13', '2025-04-21 09:00:00', 'Angelo Cabase', 'Pending', '2025-04-19 01:18:28'),
(24, 'Name Tester', 'Name@gamil.com', 'MLS', 'EUS Laptop1 w/charger (x1), EUS Laptop2 w/charger (x1), EUS Laptop4 w/charger (x1), Name (x2)', 'Purpose / Reason for Request', '2025-04-18 01:21:33', '2025-04-19 14:51:21', 'Angelo Cabase', 'Returned', '2025-04-19 01:21:33'),
(25, 'juan dela cruz', 'juan@gmail.com', 'Nursing', 'EUS Laptop1 w/charger (x1), EUS Laptop2 w/charger (x1), EUS Laptop3 w/charger (x12)', 'Form presentation later', '2025-04-18 09:30:32', '2025-04-19 11:48:46', 'Angelo Cabase', 'Returned', '2025-04-19 01:30:32'),
(26, 'test notifications', 'testnotification@gmail.com', 'Nursing', 'EUS Laptop1 w/charger (x1), EUS Laptop2 w/charger (x1), EUS Laptop3 w/charger (x1)', 'test notification', '2025-04-19 05:22:49', '2025-04-20 16:00:00', 'Angelo Cabase', 'Returned', '2025-04-19 02:05:01'),
(27, 'Gelo', 'gelo@gmail.com', 'GenEd', 'EUS Laptop1 w/charger (x1), EUS Laptop2 w/charger (x1), EUS Laptop3 w/charger (x1)', 'For presentation', '2025-04-19 05:22:51', '2025-04-20 16:00:00', 'Angelo Cabase', 'Returned', '2025-04-19 02:06:28'),
(28, 'test', 'test@gmail.com', 'GenEd', 'EUS Laptop1 w/charger (x1), test (x1)', 'test', '2025-04-18 03:33:27', '2025-04-19 09:00:00', 'Angelo Cabase', 'Approved', '2025-04-19 03:33:27'),
(29, 'test 3', 'test@gmail.com', 'GenEd', 'EUS Laptop1 w/charger (x1), EUS Laptop2 w/charger (x1), test (x100)', 'test', '2025-04-16 19:45:47', '2025-04-19 03:39:17', 'Angelo Cabase', 'Returned', '2025-04-19 03:45:47'),
(30, 'test', 'test@gmail.com', 'Respiratory', 'EUS Laptop1 w/charger, EUS Laptop2 w/charger, EUS Laptop3 w/charger, EUS Laptop4 w/charger, test', 'test', '2025-04-19 08:47:13', '2025-04-19 11:40:14', 'Angelo Cabase', 'Returned', '2025-04-19 08:47:13'),
(31, 'Requesting', 'request@gmail.com', 'Nursing', 'Mouse (x2)', 'For capstone defense', '2025-04-20 00:14:13', '2025-04-20 00:42:05', 'Angelo Cabase', 'Returned', '2025-04-20 00:14:13'),
(32, 'Gelobee', 'gelobee@gmail.com', 'Nursing', 'EUS Laptop1 w/charger, EUS Laptop2 w/charger, Mouse (x2)', 'For Presentation', '2025-04-20 00:27:21', '2025-04-21 09:00:00', NULL, 'Pending', '2025-04-20 00:27:21'),
(33, 'Gelo', 'gelo@gmail.com', 'Nursing', 'EUS Laptop1 w/charger, EUS Laptop2 w/charger', 'For presentation', '2025-04-20 01:54:01', '2025-04-20 09:00:00', NULL, 'Pending', '2025-04-20 01:54:01');

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
(1, 1, 'Flag Ceremony', '2025-04-21 08:00:00', '2025-04-21 09:30:00', 1, 1, '2025-04-20 09:31:09', '2025-04-20 10:27:33', NULL),
(2, 1, 'Afternoon Session', '2025-04-23 13:00:00', '2025-04-23 16:00:00', 0, 1, '2025-04-20 09:32:45', '2025-04-20 10:27:33', NULL),
(3, 2, 'Flag Raising Ceremony', '2025-04-21 08:30:00', '2025-04-21 09:30:00', 1, 0, '2025-04-20 09:58:00', '2025-04-20 10:27:33', NULL),
(4, 2, 'Afternoon Session', '2025-04-22 16:00:00', '2025-04-22 18:00:00', 0, 1, '2025-04-20 10:00:17', '2025-04-20 10:27:33', NULL),
(5, 2, 'test', '2025-04-23 01:00:00', '2025-04-23 13:00:00', 0, 0, '2025-04-20 10:09:26', '2025-04-20 10:33:23', NULL),
(6, 1, 'Testing sound system', '2025-04-22 14:00:00', '2025-04-22 16:00:00', 0, 1, '2025-04-20 10:16:23', '2025-04-20 10:27:33', NULL),
(7, 1, 'Testing new sound system', '2025-04-21 14:00:00', '2025-04-21 15:00:00', 1, 0, '2025-04-20 10:18:41', '2025-04-20 10:28:33', NULL),
(8, 1, 'Testing New Tv', '2025-04-21 13:00:00', '2025-04-21 14:00:00', 1, 0, '2025-04-20 10:19:40', '2025-04-20 10:27:33', NULL),
(9, 2, 'Testing TV', '2025-04-21 13:00:00', '2025-04-21 14:00:00', 1, 0, '2025-04-20 10:29:19', '2025-04-20 10:29:43', '2025-04-20 10:29:43'),
(10, 1, 'Demo ', '2025-04-21 14:00:00', '2025-04-21 15:00:00', 1, 0, '2025-04-20 10:31:58', '2025-04-20 10:32:18', '2025-04-20 10:32:18');

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
(52, 10, 'Mouse', 1);

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
(13, 'test 21', 'Furniture', 1, 'Used', 'aa', '2025-04-19 04:05:45', '2025-04-19 13:09:26');

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
(1, 'Events', 'Ongoing Events (4):\n\n- Check Range\n  From: 4/18/2025, 2:00:00 PM\n  To:   4/22/2025, 4:00:00 PM\n\n- Created From Dashboard\n  From: 4/19/2025, 9:00:00 PM\n  To:   4/21/2025, 1:00:00 PM\n\n- Student Meeting\n  From: 4/20/2025, 1:03:00 AM\n  To:   4/20/2025, 6:00:00 PM\n\n- Time 2\n  From: 4/20/2025, 2:22:00 AM\n  To:   4/21/2025, 3:23:00 PM\n\nUpcoming Events (4):\n\n- 111111111111111111\n  From: 4/20/2025, 11:00:00 AM\n  To:   4/20/2025, 7:00:00 PM\n\n- Test\n  From: 4/20/2025, 2:00:00 PM\n  To:   4/22/2025, 2:00:00 PM\n\n- Time 1\n  From: 4/21/2025, 2:00:00 AM\n  To:   4/21/2025, 8:23:00 AM\n\n- Test 1414141414141\n  From: 4/21/2025, 2:00:00 AM\n  To:   4/21/2025, 7:00:00 PM', '2025-04-20 08:24:47'),
(2, 'Borrowing', 'Gelobee from Nursing submitted a borrow request for \"EUS Laptop1 w/charger, EUS Laptop2 w/charger, Mouse (x2)\".', '2025-04-20 08:27:21'),
(3, 'Borrowing', 'Gelo from Nursing submitted a borrow request for \"EUS Laptop1 w/charger, EUS Laptop2 w/charger\".', '2025-04-20 09:54:01'),
(4, 'Events', 'Upcoming Events (1):\n\n- Create New Event\n  From: 4/21/2025, 10:00:00 AM\n  To:   4/24/2025, 6:00:00 PM', '2025-04-20 10:00:13'),
(5, 'Events', 'Upcoming Events (2):\n\n- Test 2\n  From: 4/21/2025, 1:00:00 PM\n  To:   4/21/2025, 3:00:00 PM\n\n- Test 2\n  From: 4/21/2025, 1:00:00 PM\n  To:   4/25/2025, 3:00:00 PM', '2025-04-20 13:00:04'),
(6, 'Events', 'Upcoming Events (1):\n\n- Flag Ceremony\n  From: 4/21/2025, 8:00:00 AM\n  To:   4/21/2025, 9:00:00 AM', '2025-04-20 16:48:05'),
(7, 'Events', 'Upcoming Events (1):\n\n- Flag Ceremony\n  From: 4/21/2025, 8:00:00 AM\n  To:   4/21/2025, 9:30:00 AM', '2025-04-20 17:31:19'),
(8, 'Your Personal Events', 'You have 1 personal event(s) coming up:\n\n- Flag Raising Ceremony\n  From: 4/21/2025, 8:30:00 AM\n  To:   4/21/2025, 9:30:00 AM', '2025-04-20 17:58:03'),
(9, 'Public Events', 'Upcoming Public Events:\n\n- Testing new sound system\n  From: 4/21/2025, 2:00:00 PM\n  To:   4/21/2025, 3:00:00 PM', '2025-04-20 18:18:49'),
(10, 'Your Personal Events', 'You have 1 personal event(s) coming up:\n\n- Testing New Tv\n  From: 4/21/2025, 1:00:00 PM\n  To:   4/21/2025, 2:00:00 PM', '2025-04-20 18:19:48'),
(11, 'Your Personal Events', 'You have 1 personal event(s) coming up:\n\n- Testing TV\n  From: 4/21/2025, 1:00:00 PM\n  To:   4/21/2025, 2:00:00 PM', '2025-04-20 18:29:23'),
(12, 'Public Events', 'Upcoming Public Events:\n\n- Testing TV\n  From: 4/21/2025, 1:00:00 PM\n  To:   4/21/2025, 2:00:00 PM', '2025-04-20 18:29:43'),
(13, 'Your Personal Events', 'You have 1 personal event(s) coming up:\n\n- Demo \n  From: 4/21/2025, 2:00:00 PM\n  To:   4/21/2025, 3:00:00 PM', '2025-04-20 18:31:58'),
(14, 'Public Events', 'Upcoming Events:\n\n- Demo \n  From: 4/21/2025, 2:00:00 PM\n  To:   4/21/2025, 3:00:00 PM', '2025-04-20 18:32:18');

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
(1, 1, 1, 0, NULL),
(2, 1, 2, 0, NULL),
(3, 1, 3, 0, NULL),
(4, 1, 4, 0, NULL),
(5, 1, 8, 0, NULL),
(6, 2, 1, 0, NULL),
(7, 2, 2, 0, NULL),
(8, 2, 3, 0, NULL),
(9, 2, 4, 0, NULL),
(10, 2, 8, 0, NULL),
(11, 3, 1, 0, NULL),
(12, 3, 2, 0, NULL),
(13, 3, 3, 0, NULL),
(14, 3, 4, 0, NULL),
(15, 3, 8, 0, NULL),
(16, 4, 1, 0, NULL),
(17, 4, 2, 0, NULL),
(18, 4, 3, 0, NULL),
(19, 4, 4, 0, NULL),
(20, 4, 8, 0, NULL),
(21, 5, 1, 0, NULL),
(22, 5, 2, 0, NULL),
(23, 5, 3, 0, NULL),
(24, 5, 4, 0, NULL),
(25, 5, 8, 0, NULL),
(26, 6, 1, 0, NULL),
(27, 6, 2, 0, NULL),
(28, 6, 3, 0, NULL),
(29, 6, 4, 0, NULL),
(30, 6, 8, 0, NULL),
(31, 7, 1, 0, NULL),
(32, 7, 2, 0, NULL),
(33, 7, 3, 0, NULL),
(34, 7, 4, 0, NULL),
(35, 7, 8, 0, NULL),
(36, 8, 2, 0, NULL),
(37, 9, 1, 0, NULL),
(38, 9, 2, 0, NULL),
(39, 9, 3, 0, NULL),
(40, 9, 4, 0, NULL),
(41, 9, 8, 0, NULL),
(42, 9, 1, 0, NULL),
(43, 10, 1, 0, NULL),
(44, 11, 2, 0, NULL),
(45, 12, 1, 0, NULL),
(46, 12, 2, 0, NULL),
(47, 12, 3, 0, NULL),
(48, 12, 4, 0, NULL),
(49, 12, 8, 0, NULL),
(50, 12, 2, 0, NULL),
(51, 13, 1, 0, NULL),
(52, 14, 1, 0, NULL),
(53, 14, 2, 0, NULL),
(54, 14, 3, 0, NULL),
(55, 14, 4, 0, NULL),
(56, 14, 8, 0, NULL),
(57, 14, 1, 0, NULL);

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
(2, 'angelo cabase', 'goldengrape777@gmail.com', '$2b$10$/Des5DS6YyWQx4gGyXRj0egG3wIbj4VfxzjwienlVNB1QgHmmeLta', 'staff', 'profile/1744338228306.jpg', 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjI1ZjgyMTE3MTM3ODhiNjE0NTQ3NGI1MDI5YjAxNDFiZDViM2RlOWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1ODA1Njg3MjEwMTYtZjY5cWlxbzgyZGhsN3N1bG1zMWY1dWJyNTB0YnJmNmkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1ODA1Njg3MjEwMTYtaGFpNmkxdXBobXBlaDZqOW1vbTVpZjY2Nmg5dXY0MmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE1MjE5NDM4MzQ1MDU0MDM0MjgiLCJlbWFpbCI6ImdvbGRlbmdyYXBlNzc3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiYW5nZWxvIGNhYmFzZSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKT3hIenhTV3NFMlk5bFpibzNlaEpSdlhYZC1NZkNHM1hKcnJHY1pIalRtaUNiMGc9czk2LWMiLCJnaXZlbl9uYW1lIjoiYW5nZWxvIiwiZmFtaWx5X25hbWUiOiJjYWJhc2UiLCJpYXQiOjE3NDEyMjA5MjMsImV4cCI6MTc0MTIyNDUyM30.JkFjD2Slon2KIJREvqC7jria-SrBPwk_fny2-lQ00oSf-tC8dvy1SjYFp9qFExKJdGZWEUKuKvR_mzP8tjyAlAqT1w9Q3Q1W5MH76uNAApb-UtrnlzNLSvzebCBQ1U-cRX3uLf-x26UEIl09803QT5YfjUwHXW8hIcgwQwbZ5Qc6FLFWhMBKi3Qa_qkLylG0D-QrBaZ5lgRq_OaraMyiuOi9WCkN8Jz8_ufEjPuFAhowYQUW6il1P6rmohsLwuld9MXxru5CJxRz_LgHH3lLqO1gDzwzFlakrpdG5QvZxZeNbIuqdG9eSm2n8Q4BREXCseovEPjSme6sXfqiTALy7g', 1, '2025-03-05 09:20:45'),
(3, 'Unknow User', 'cabase.1324@gmail.com', '$2b$10$/Des5DS6YyWQx4gGyXRj0egG3wIbj4VfxzjwienlVNB1QgHmmeLta', 'staff', 'profile/1744338221459.jpg', 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjI1ZjgyMTE3MTM3ODhiNjE0NTQ3NGI1MDI5YjAxNDFiZDViM2RlOWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1ODA1Njg3MjEwMTYtZjY5cWlxbzgyZGhsN3N1bG1zMWY1dWJyNTB0YnJmNmkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1ODA1Njg3MjEwMTYtaGFpNmkxdXBobXBlaDZqOW1vbTVpZjY2Nmg5dXY0MmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTgxMTU5NDA5NzE4OTMyNDcyOTciLCJlbWFpbCI6ImNhYmFzZS4xMzI0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiVW5rbm93IFVzZXIiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSzZ1MTFJVVBkaWRhUEdOdFlsVEJramtMQ0wwcUI2YzlGQ0x1MHVpcjVGbWkxS1BBPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlVua25vdyIsImZhbWlseV9uYW1lIjoiVXNlciIsImlhdCI6MTc0MTIyNDc4NCwiZXhwIjoxNzQxMjI4Mzg0fQ.GxwsRhnYGhFbQIlW5IYSrPrBRnOcPZu6a_QcUKNuLkLUD47ewC2l2k5Cmf5PBmRzZaVI-rlJuU0Ba3ir27isOgm7Aw-HS3dM2zmDyxeTTcsp_GM4LJcqDnqQfY4lolbv9-T41xs-jgznJzwmkiurynmgAYTZtbuzMh6J9O1UDptdyAUiLq-Ae-czLr-mn_eFhb_0fum04bZvyo1IGJ6Z6TI5mVAvwTJn5gwGRyyD3xfN9f77QJ2UgrM6dVFAkuoNF2Wf2OjqXT18kycA64migkLtZr5c1KF7t3FmAW8YsAe7AQgRrtVcZUWtRCqiAG74xpyoCjhwhw8f4fxQILVLzw', 1, '2025-03-05 09:33:04'),
(4, 'Gelo cabase', 'silverlemon777@gmail.com', '$2b$10$/Des5DS6YyWQx4gGyXRj0egG3wIbj4VfxzjwienlVNB1QgHmmeLta', 'staff', 'profile/1744375756219.jpg', '115140714590763332758', 1, '2025-03-24 09:57:28'),
(5, 'Test', 'sample@gmail.com', '$2b$10$V9DqN307V36.0F3gY5waM.nMbi72T1R8FlWeOaLuzLjbjJuFlVTYK', 'user', NULL, '', 1, '2025-04-10 20:53:43'),
(6, 'Unknow User', 'goldenpaper777@gmail.com', '$2b$10$FuDKocDdf0o7vBv9xcsRl.haDD9Jt.owCbDaJ1cgVp5tTy/jxrBIi', 'user', 'profile/1744956399150.jpg', '108906153753455574585', 1, '2025-04-18 06:06:39'),
(8, '12345', 'sample2@gmail.com', '$2b$10$Xt7Wz2a1Zhv4rxjn0XozouRFKm5pFugmavv4d.5UZ2PUTbM9.4NUG', 'staff', NULL, '', 1, '2025-04-19 06:43:29'),
(10, 'test', 'test@gmail.com', '$2b$10$tVIR0aQkS8gGsWQoPycq5OoRd3uMU84syhVa9IjCwZ5qADyz2R7jq', 'user', NULL, '', 1, '2025-04-19 14:12:36'),
(11, 'test', 'test2@gmail.com', '$2b$10$aKCvBdx3Nc2RZfSmmBisAOvQ70Bs3WP9R7XlYrd/TWpR/vKOVMaKO', 'user', NULL, '', 1, '2025-04-19 14:12:53'),
(12, 'test', 'test3@gmail.com', '$2b$10$QOeaS4OU7ScOw9fjnXyqPOnY7sGyqlQw3LDnQwDWFJ7Ewb971O7Y2', 'user', NULL, '', 1, '2025-04-19 14:16:24'),
(13, 'Test 4', 'test4@gmail.com', '$2b$10$MipPAWp8DC7wxg2vNRcmeeog2f30QGbkdsO83m2S9/g4FG6Pe5pfq', 'user', NULL, '', 1, '2025-04-19 14:26:54'),
(14, 'Test 4', 'test5@gmail.com', '$2b$10$Rj1UKioYsULP.q6lOBlS1e7IaXJxEDbAF3B7EmDfRoyz5Fya4qovu', 'user', NULL, '', 1, '2025-04-19 14:28:47');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `event_preparations`
--
ALTER TABLE `event_preparations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `inventory_items`
--
ALTER TABLE `inventory_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `notification_receivers`
--
ALTER TABLE `notification_receivers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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

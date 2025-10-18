-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 15, 2025 at 06:48 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aviyamagnus_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `course_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `course_name`, `description`, `duration`, `price`) VALUES
(1, 'Human Resource Management', 'Learn HR policies, recruitment, and employee engagement', '6 - 9 months', 18.00),
(2, 'Marketing & Sales', 'Learn Marketing Strategies, sales techniques, and targeting customers', '6 - 9 months', 18.00),
(3, 'Business Management', 'Effective management and professional skills', '6 - 9 months', 18000.00),
(4, 'Entrepreneurship & Startups', 'Business planning, funding, and operations', '6 - 9 months', 18000.00),
(5, 'Leadership & Team Management', 'Skills for managing teams and leadership development', '6 - 9 months', 18.00),
(6, 'Trade & Commerce', 'Trading Analysis and Market Standards', '6 - 9 months', 18.00),
(7, 'Financial Accounting', 'Basics of accounting, ledgers, and reports', '6 - 9 months', 18000.00),
(8, 'Social Media Marketing & Strategies', 'Analyze and learn all the social media platform strategic marketing techniques', '6 - 9 months', 18000.00),
(9, 'Supply Chain Management', 'Inventory, logistics, and procurement management', '6 - 9 months', 18000.00),
(10, 'Photography & Videography', 'Master photography and videography skills to bring your creative vision to life.', '6 - 9 months', 18000.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

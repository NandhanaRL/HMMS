-- =======================================================
-- Hostel & Mess Management System (HMMS)
-- Complete Relational Database Schema & Initial Seed Data
-- =======================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. USER TABLE
CREATE TABLE IF NOT EXISTS `USER` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('ADMIN', 'WARDEN', 'MESS_MANAGER', 'STUDENT') NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. STUDENT TABLE
CREATE TABLE IF NOT EXISTS `STUDENT` (
  `student_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `roll_no` VARCHAR(50) NOT NULL UNIQUE,
  `department` VARCHAR(100) NOT NULL,
  `year_of_study` INT NOT NULL,
  `guardian_contact` VARCHAR(20) DEFAULT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `USER`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. WARDEN TABLE
CREATE TABLE IF NOT EXISTS `WARDEN` (
  `warden_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `hostel_block` VARCHAR(50) DEFAULT 'Block A',
  FOREIGN KEY (`user_id`) REFERENCES `USER`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. MESS MANAGER TABLE
CREATE TABLE IF NOT EXISTS `MESS_MANAGER` (
  `manager_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `mess_name` VARCHAR(100) DEFAULT 'Central Dining Hall',
  FOREIGN KEY (`user_id`) REFERENCES `USER`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. ROOM TABLE
CREATE TABLE IF NOT EXISTS `ROOM` (
  `room_id` INT AUTO_INCREMENT PRIMARY KEY,
  `room_number` VARCHAR(20) NOT NULL UNIQUE,
  `room_type` ENUM('SINGLE', 'DOUBLE', 'TRIPLE') NOT NULL,
  `capacity` INT NOT NULL,
  `occupied_count` INT DEFAULT 0,
  `status` ENUM('AVAILABLE', 'FULL') DEFAULT 'AVAILABLE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. ROOM ALLOCATION TABLE
CREATE TABLE IF NOT EXISTS `ROOM_ALLOCATION` (
  `allocation_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `room_id` INT NOT NULL,
  `allocated_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `STUDENT`(`student_id`) ON DELETE CASCADE,
  FOREIGN KEY (`room_id`) REFERENCES `ROOM`(`room_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS `ATTENDANCE` (
  `attendance_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `date` DATE NOT NULL,
  `meal_type` ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'DAILY') NOT NULL,
  `present` BOOLEAN DEFAULT FALSE,
  UNIQUE KEY `unique_student_date_meal` (`student_id`, `date`, `meal_type`),
  FOREIGN KEY (`student_id`) REFERENCES `STUDENT`(`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. LEAVE APPLICATION TABLE
CREATE TABLE IF NOT EXISTS `LEAVE_APPLICATION` (
  `leave_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `from_date` DATE NOT NULL,
  `to_date` DATE NOT NULL,
  `reason` TEXT NOT NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
  `warden_id` INT DEFAULT NULL,
  `applied_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `STUDENT`(`student_id`) ON DELETE CASCADE,
  FOREIGN KEY (`warden_id`) REFERENCES `WARDEN`(`warden_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. FEE TABLE
CREATE TABLE IF NOT EXISTS `FEE` (
  `fee_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `fee_type` VARCHAR(50) DEFAULT 'HOSTEL_MESS',
  `due_date` DATE DEFAULT NULL,
  `status` ENUM('PAID', 'PENDING', 'UNPAID') DEFAULT 'PENDING',
  `paid_date` TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (`student_id`) REFERENCES `STUDENT`(`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. COMPLAINT TABLE
CREATE TABLE IF NOT EXISTS `COMPLAINT` (
  `complaint_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `category` ENUM('ROOM', 'MESS', 'MAINTENANCE', 'OTHER') NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED') DEFAULT 'OPEN',
  `resolved_by` INT DEFAULT NULL,
  `submitted_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `resolved_date` TIMESTAMP NULL DEFAULT NULL,
  `resolution_notes` TEXT DEFAULT NULL,
  FOREIGN KEY (`student_id`) REFERENCES `STUDENT`(`student_id`) ON DELETE CASCADE,
  FOREIGN KEY (`resolved_by`) REFERENCES `WARDEN`(`warden_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS `NOTIFICATIONS` (
  `notification_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. MENU ITEM TABLE
CREATE TABLE IF NOT EXISTS `menu_item` (
  `item_id` INT AUTO_INCREMENT PRIMARY KEY,
  `mess_id` INT DEFAULT 1,
  `name` VARCHAR(150) NOT NULL,
  `meal_type` ENUM('BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER') NOT NULL,
  `day` VARCHAR(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- =======================================================
-- INITIAL SEED DATA (Default Password for demo: password123)
-- Hash generated via bcrypt (10 rounds): $2b$10$3euPcmQFCiblsZeEu5s7p.VvPj7q6K6eE40M9oYlKq5p4nI0C1B0q
-- =======================================================

-- Admin user (username: admin, password: password123)
INSERT INTO `USER` (`username`, `email`, `password_hash`, `role`, `phone`)
VALUES ('admin', 'admin@hmms.edu', '$2b$10$3euPcmQFCiblsZeEu5s7p.VvPj7q6K6eE40M9oYlKq5p4nI0C1B0q', 'ADMIN', '9876543210')
ON DUPLICATE KEY UPDATE `user_id`=`user_id`;

-- Warden user (username: warden, password: password123)
INSERT INTO `USER` (`username`, `email`, `password_hash`, `role`, `phone`)
VALUES ('warden', 'warden@hmms.edu', '$2b$10$3euPcmQFCiblsZeEu5s7p.VvPj7q6K6eE40M9oYlKq5p4nI0C1B0q', 'WARDEN', '9876543211')
ON DUPLICATE KEY UPDATE `user_id`=`user_id`;

INSERT INTO `WARDEN` (`user_id`, `hostel_block`)
SELECT `user_id`, 'Block A' FROM `USER` WHERE `username` = 'warden'
ON DUPLICATE KEY UPDATE `warden_id`=`warden_id`;

-- Mess Manager (username: messmanager, password: password123)
INSERT INTO `USER` (`username`, `email`, `password_hash`, `role`, `phone`)
VALUES ('messmanager', 'mess@hmms.edu', '$2b$10$3euPcmQFCiblsZeEu5s7p.VvPj7q6K6eE40M9oYlKq5p4nI0C1B0q', 'MESS_MANAGER', '9876543212')
ON DUPLICATE KEY UPDATE `user_id`=`user_id`;

INSERT INTO `MESS_MANAGER` (`user_id`, `mess_name`)
SELECT `user_id`, 'Central Dining Hall' FROM `USER` WHERE `username` = 'messmanager'
ON DUPLICATE KEY UPDATE `manager_id`=`manager_id`;

-- Student (username: student, password: password123)
INSERT INTO `USER` (`username`, `email`, `password_hash`, `role`, `phone`)
VALUES ('student', 'student@hmms.edu', '$2b$10$3euPcmQFCiblsZeEu5s7p.VvPj7q6K6eE40M9oYlKq5p4nI0C1B0q', 'STUDENT', '9876543213')
ON DUPLICATE KEY UPDATE `user_id`=`user_id`;

INSERT INTO `STUDENT` (`user_id`, `roll_no`, `department`, `year_of_study`, `guardian_contact`)
SELECT `user_id`, 'CS202601', 'Computer Science & Engineering', 4, '9876543299' FROM `USER` WHERE `username` = 'student'
ON DUPLICATE KEY UPDATE `student_id`=`student_id`;

-- Sample Rooms
INSERT INTO `ROOM` (`room_number`, `room_type`, `capacity`, `occupied_count`, `status`) VALUES
('A-101', 'SINGLE', 1, 1, 'FULL'),
('A-102', 'DOUBLE', 2, 1, 'AVAILABLE'),
('A-103', 'TRIPLE', 3, 0, 'AVAILABLE')
ON DUPLICATE KEY UPDATE `room_id`=`room_id`;

-- Sample Menu
INSERT INTO `menu_item` (`mess_id`, `name`, `meal_type`, `day`) VALUES
(1, 'Masala Dosa, Sambar & Chutney', 'BREAKFAST', 'Monday'),
(1, 'Vegetable Biryani, Raita & Gulab Jamun', 'LUNCH', 'Monday'),
(1, 'Tea & Veg Samosa', 'SNACKS', 'Monday'),
(1, 'Chapati, Paneer Butter Masala & Dal Tadka', 'DINNER', 'Monday'),
(1, 'Poori Bhaji & Filter Coffee', 'BREAKFAST', 'Tuesday'),
(1, 'South Indian Thali (Rice, Sambar, Rasam, Poriyal)', 'LUNCH', 'Tuesday'),
(1, 'Tea & Biscuits', 'SNACKS', 'Tuesday'),
(1, 'Fried Rice & Veg Manchurian', 'DINNER', 'Tuesday')
ON DUPLICATE KEY UPDATE `item_id`=`item_id`;

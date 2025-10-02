-- Smart Parking Database Schema

CREATE DATABASE IF NOT EXISTS smart_parking;
USE smart_parking;

-- Table for parking slots
CREATE TABLE IF NOT EXISTS parking_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slot_number INT UNIQUE,
    status ENUM('available', 'booked') DEFAULT 'available'
);

-- Insert 15 slots
INSERT INTO parking_slots (slot_number) VALUES
(1),(2),(3),(4),(5),(6),(7),(8),(9),(10),
(11),(12),(13),(14),(15);

-- Table for bookings
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(20),
    license_plate VARCHAR(58),
    date DATE,
    start_time TIME,
    end_time TIME,
    hours INT,
    slot_id INT,
    FOREIGN KEY (slot_id) REFERENCES parking_slots(id)
);

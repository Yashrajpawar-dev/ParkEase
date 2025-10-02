# ParkEase
A smart and seamless parking management app that lets users check slot availability in real-time, book instantly, and get digital receipts with ease.
# 🚗 ParkEase — Smart Parking System

ParkEase is a simple parking management system that helps track available slots and allows users to book them easily.  

---

## 📌 Overview
- Manage parking slots  
- Book slots with name, phone, license plate, and time range  
- Track availability (available/booked)  
- Store booking details in a MySQL database  

---

## 🗄 Database Schema

### Parking Slots Table
```sql
CREATE TABLE parking_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slot_number INT UNIQUE,
    status ENUM('available','booked') DEFAULT 'available'
);
```

### Insert Slots
```sql
INSERT INTO parking_slots (slot_number) VALUES
(1),(2),(3),(4),(5),(6),(7),(8),(9),(10),
(11),(12),(13),(14),(15);
```

### Bookings Table
```sql
CREATE TABLE bookings (
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
```

---

## ⚙️ How to Run

1. Clone the repo:
   ```bash
   git clone https://github.com/Yashrajpawar-dev/ParkEase.git
   cd ParkEase
   ```

2. Import the database:
   ```bash
   mysql -u root -p < schema.sql
   ```
2. run the project:
 ```bash
node server.js
 ```



---

## 🚀 Features
- Book a parking slot with time range  
- Track available vs booked slots  
- Store user booking details  

---

## 🔮 Future Enhancements
- Real-time slot availability  
- Payment integration  
- QR/RFID entry system  
- Admin dashboard  

---

## 👨‍💻 Author
**Yashraj Pawar**  
GitHub: [Yashrajpawar-dev](https://github.com/Yashrajpawar-dev) 

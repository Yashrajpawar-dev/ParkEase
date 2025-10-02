const express = require('express');
const mysql = require('mysql2');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  
  database: ''
});


db.connect(err => {
  if (err) {
    console.error(' Could not connect to MySQL:', err.message);
  } else {
    console.log(' Connected to MySQL database');
  }
});


app.get('/slots', (req, res) => {
  const { date, time, hours } = req.query;
  if (!date || !time || !hours) return res.status(400).json({ error: 'Missing params' });

  const [h, m] = time.split(':');
  const endHour = parseInt(h) + parseInt(hours);
  const endTime = `${endHour.toString().padStart(2,'0')}:${m}:00`;

  const sql = `
    SELECT * FROM parking_slots WHERE id NOT IN (
      SELECT slot_id FROM bookings
      WHERE date=? AND (
        (start_time <= ? AND end_time > ?) OR
        (start_time < ? AND end_time >= ?) OR
        (start_time >= ? AND start_time < ?)
      )
    )`;
  db.query(sql, [date, time, time, endTime, endTime, time, endTime], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


app.post('/book', (req, res) => {
  const { name, phone, license_plate, date, time, hours, slot_id } = req.body;
  const [h, m] = time.split(':');
  const endHour = parseInt(h) + parseInt(hours);
  const endTime = `${endHour.toString().padStart(2,'0')}:${m}:00`;

  const checkSql = `
    SELECT * FROM bookings
    WHERE slot_id=? AND date=? AND (
      (start_time <= ? AND end_time > ?) OR
      (start_time < ? AND end_time >= ?) OR
      (start_time >= ? AND start_time < ?)
    )`;
  db.query(checkSql, [slot_id, date, time, time, endTime, endTime, time, endTime], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (rows.length > 0) return res.status(400).json({ message: 'Slot already booked for this time' });

    const insertSql = `INSERT INTO bookings (name, phone, license_plate, date, start_time, end_time, hours, slot_id)
                       VALUES (?,?,?,?,?,?,?,?)`;
    db.query(insertSql, [name, phone, license_plate, date, time, endTime, hours, slot_id], (err, result) => {
      if (err) return res.status(500).json(err);

      db.query('SELECT slot_number FROM parking_slots WHERE id=?', [slot_id], (err2, row) => {
        if (err2) return res.status(500).json(err2);

        const slotNum = row[0].slot_number;
        const amount = hours * 20; 

        io.emit('slotUpdate', { slot_id, date, time, hours });
        res.json({
          message: 'Booked successfully',
          bookingId: result.insertId,
          slot_number: slotNum,
          date,
          time,
          hours,
          amount
        });
      });
    });
  });
});

server.listen(5000, () => console.log(' Server running at http://localhost:5000'));

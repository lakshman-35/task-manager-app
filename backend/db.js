const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',     // your MySQL password
  database: 'taskmate'
});

db.connect((err) => {
  if (err) {
    console.error('DB connection error:', err.message);
  } else {
    console.log('Connected to MySQL DB');
  }
});

module.exports = db;

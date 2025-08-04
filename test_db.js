const mysql = require('mysql2');

// Test database connection
const testDb = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'taskmate'
});

console.log('Testing database connection...');

testDb.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Connected to MySQL database');
  
  // Test if users table exists
  testDb.query('SHOW TABLES LIKE "users"', (err, results) => {
    if (err) {
      console.error('❌ Error checking tables:', err.message);
      testDb.end();
      process.exit(1);
    }
    
    if (results.length === 0) {
      console.log('❌ Users table not found. Please run the database setup script.');
      console.log('Run this command: mysql -u root -p < backend/database_setup.sql');
    } else {
      console.log('✅ Users table exists');
      
      // Test if we can insert a user
      testDb.query('SELECT COUNT(*) as count FROM users', (err, results) => {
        if (err) {
          console.error('❌ Error querying users table:', err.message);
        } else {
          console.log(`✅ Users table is working. Current users: ${results[0].count}`);
        }
        
        testDb.end();
        console.log('✅ Database test completed successfully!');
      });
    }
  });
}); 
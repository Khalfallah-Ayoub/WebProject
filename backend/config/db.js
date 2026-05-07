const { Pool } = require('pg');

// Decode URL-encoded password
const connectionString = process.env.DATABASE_URL;
const decodedConnectionString = connectionString ? connectionString.replace(/%40/g, '@') : null;

const pool = new Pool({
  connectionString: decodedConnectionString,
  ssl: process.env.DATABASE_SSL === 'true' ? { 
    rejectUnauthorized: false 
  } : false,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 20,
});

let isConnected = false;

// Handle connection errors gracefully
pool.on('error', (err) => {
  console.error('❌ Database connection failed:', err.message);
  isConnected = false;
});

pool.on('connect', () => {
  console.log('✅ Database connected successfully');
  isConnected = true;
});

// Test initial connection
if (connectionString) {
  pool.query('SELECT NOW()', (err) => {
    if (err) {
      console.error('❌ Database connection failed:', err.message);
    } else {
      console.log('✅ Database connected successfully');
      isConnected = true;
    }
  });
}

pool.getStatus = () => isConnected;

module.exports = pool;

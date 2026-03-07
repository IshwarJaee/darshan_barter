const mysql = require('mysql2/promise');
require('dotenv').config();

const required = ['DB_HOST', 'DB_USER', 'DB_NAME'];
required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌  Missing required env variable: ${key}`);
    console.error('   → Check your backend/.env file');
  }
});

const pool = mysql.createPool({
  host:             process.env.DB_HOST     || 'localhost',
  user:             process.env.DB_USER     || 'root',
  password:         process.env.DB_PASSWORD || '',
  database:         process.env.DB_NAME     || 'darshan_barter',
  waitForConnections: true,
  connectionLimit:  10,
  queueLimit:       0,
  enableKeepAlive:  true,
  keepAliveInitialDelay: 0,
});

module.exports = pool;
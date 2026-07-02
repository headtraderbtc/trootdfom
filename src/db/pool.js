const { Pool } = require('pg');

// Railway automatically injects these when services are linked
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
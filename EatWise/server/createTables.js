import pool from './utils/db.js';

const createTables = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // OTPs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS otps (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        otp VARCHAR(6) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP
      );
    `);

    // Analysis reports table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analysis_reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        report_data JSONB,
        image_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add image_path column if it doesn't exist
    await pool.query(`
      ALTER TABLE analysis_reports
      ADD COLUMN IF NOT EXISTS image_path VARCHAR(255);
    `);

    console.log("Tables created successfully!");
    pool.end();
  } catch (err) {
    console.error("Error creating tables:", err);
    pool.end();
  }
};

createTables();

import mysql from 'mysql2';
import dotenv from 'dotenv';

// PENTING: Panggil dotenv.config() di sini juga
// untuk memastikan file ini bisa berjalan mandiri dan variabel env selalu tersedia.
dotenv.config();

// Membuat "connection pool"
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Langsung ekspor pool
export default pool;
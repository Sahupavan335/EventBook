import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

/* ===========================
   CREATE CONNECTION POOL
=========================== */
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10, // number of connections
  queueLimit: 0
});

/* ===========================
   TEST CONNECTION
=========================== */
db.getConnection((err, connection) => {

  if (err) {
    console.error("DB connection failed:", err.message);
  } else {
    console.log("MySQL Connected ✅");
    connection.release(); // important
  }

});

export default db;
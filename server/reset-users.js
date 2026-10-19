const Database = require("better-sqlite3");
const db = new Database("shop.db");

db.exec(`
  DROP TABLE IF EXISTS users;
  CREATE TABLE users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer'
  
  );
  `);

  console.log("User table rebuilt");
const Database = require("better-sqlite3");
const bcrypt =require("bcryptjs");

const [email, password, ...nameParts] = process.argv.slice(2);
if (!email || !password || password.length <8){
  console.log("Usage: node create-admin.js <email> <password, 8+ chars> [name]");
  process.exit(1)
}

const db = new Database ("shop.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer'
  )
  `);

  db.prepare(`
    INSERT INTO users (name, email, password_hash, role) VALUES(?, ?, ?, 'admin')
    ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, role = 'admin'
    `).run(nameParts.join("") || "Admin", email.trim().toLocaleLowerCase(), bcrypt.hashSync(password, 10));
    
    console.log("Admin ready:", email.trim().toLocaleLowerCase());
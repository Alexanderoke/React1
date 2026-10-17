const Database = require("better-sqlite3");
const db = new Database("shop.db");

db.exec(`
  DROP TABLE IF EXISTS order_items;
  DROP TABLE IF EXISTS order_item;
  DROP TABLE IF EXISTS orders;

  CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    total REAL NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    qty INTEGER NOT NULL
  );
`);

console.log("Orders tables rebuilt");
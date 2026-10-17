const Database = require("better-sqlite3");
const db = new Database("shop.db");

console.log("TABLES:");
for (const t of db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all()) {
  console.log("-", t.name);
}

for (const table of ["orders", "order_items"]) {
  console.log(`\n${table} columns:`);
  console.log(db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name).join(", "));
}

console.log("\nProducts:");
console.log(db.prepare("SELECT id, name, price FROM products").all());
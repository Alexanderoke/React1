const Database = require("better-sqlite3");
const db = new Database("shop.db");

const insert = db.prepare("INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)");
insert.run("Running shoes", 59.99, "Comfortable running shoes for everyday use.", "https://picsum.photos/seed/shoes/300/200");
insert.run("Backpack", 39.99, "Durable backpack with multiple compartments.", "https://picsum.photos/seed/bag/300/200");
insert.run("Watter bottle", 12.99, "keeps drinks cold for 24 hours.", "https://picsum.photos/seed/bottle/300/200");

console.log("seeded 3 products.");
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database("shop.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT DEFAULT '',
    image TEXT DEFAULT ''
  )
`);

// READ all
app.get("/api/products", (req, res) => {
  res.json(db.prepare("SELECT * FROM products").all());
});

// READ one
app.get("/api/products/:id", (req, res) => {
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json(product);
});

// CREATE
app.post("/api/products", (req, res) => {
  const { name, price, description = "", image = "" } = req.body;
  if (!name || price == null) return res.status(400).json({ error: "name and price required" });
  const result = db
    .prepare("INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)")
    .run(name, price, description, image);
  res.status(201).json({ id: result.lastInsertRowid, name, price, description, image });
});

// UPDATE
app.put("/api/products/:id", (req, res) => {
  const { name, price, description, image } = req.body;
  const result = db
    .prepare("UPDATE products SET name = ?, price = ?, description = ?, image = ? WHERE id = ?")
    .run(name, price, description, image, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Not found" });
  res.json({ id: Number(req.params.id), name, price, description, image });
});

// DELETE
app.delete("/api/products/:id", (req, res) => {
  const result = db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Not found" });
  res.status(204).end();
});

app.listen(3001, () => console.log("API running on http://localhost:3001"));
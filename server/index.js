const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const bcrypt = require ("bcryptjs");
const jwt = require("jsonwebtoken");

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

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

db.exec(`
  CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer'
    )
  `);
  function signToken(user) {
    return jwt.sign({id: user.id, role:user.role}, JWT_SECRET, {expiresIn: "7d"});    
  }

  function publicUser(u){
    return{id: u.id, name: u.name, email: u.email, role: u.role};
  }

  function requireAuth(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Login required"});
    try{
      req.user = jwt.verify(token, JWT_SECRET);
      next();
    }catch {
      res.status(401).json({ error: "Session expired, please login again" });
    }
  }

  function requireAdmin(req, res, next) {
    requireAuth(req, res, () => {
      if (req.user.role !== "admin") {
        return res.status(403).json({error: "Admins only"});
      }
      next();
    });    
  }

  app.post("/api/auth/register", (req, res) => {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!name || !email || password.length <8) {
      return res.status(400).json({error: "Name, email and a password of 8+ characters required"});      
    }
    if (db.prepare("SELECT id FROM users WHERE email = ?").get(email)) {
      return res.status(409).json({error: "Email already registered"});      
    }
    const hash = bcrypt.hashSync(password, 10);
    const result = db
      .prepare("INSERT INTO users (name, email, password_hash) VALUES(?,?,?)")
      .run(name, email, hash);
    const user = db.prepare("SELECT * FROM users WHERE id= ?").get(result.lastInsertRowid);
    res.status(201).json({ token: signToken(user), user: publicUser(user)});
  });

  app.post("/api/auth/login", (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  console.log("LOGIN attempt:", JSON.stringify(email), "| user found:", Boolean(user), "| password length:", password.length);
  console.log("DB file in use:", require("path").resolve("shop.db"));
  const ok = user ? bcrypt.compareSync(password, user.password_hash) : false;
  console.log("password matches:", ok);
  if (!ok) {
    return res.status(401).json({ error: "Wrong email or password" });
  }
  res.json({ token: signToken(user), user: publicUser(user) });
});

  app.get("/api/auth/me", requireAuth, (req, res) => {
    const user =db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
    if(!user) return res.status(401).json({error: "Account not found"});
    res.json(publicUser(user));
  });

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
app.post("/api/products", requireAdmin, (req, res) => {
  const { name, price, description = "", image = "" } = req.body;
  if (!name || price == null) return res.status(400).json({ error: "name and price required" });
  const result = db
    .prepare("INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)")
    .run(name, price, description, image);
  res.status(201).json({ id: result.lastInsertRowid, name, price, description, image });
});

// UPDATE
app.put("/api/products/:id",requireAdmin, (req, res) => {
  const { name, price, description, image } = req.body;
  const result = db
    .prepare("UPDATE products SET name = ?, price = ?, description = ?, image = ? WHERE id = ?")
    .run(name, price, description, image, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Not found" });
  res.json({ id: Number(req.params.id), name, price, description, image });
});

// DELETE
app.delete("/api/products/:id", requireAdmin, (req, res) => {
  const result = db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Not found" });
  res.status(204).end();
});

db.exec(`
 

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    total REAL NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP  
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    qty INTEGER NOT NULL  
  );
  `);

  app.post("/api/orders", (req, res) =>{
    const {customer_name, email, items} = req.body;
    if (!customer_name || !email || !Array.isArray(items) || items.length===0) {
      return res.status (400).json({error: "name, email and item required"});      
    }

    //look prices up in the database; never trust price sent by the browser
    const getProduct = db.prepare("SELECT * FROM products WHERE id = ?");
    const lines =[];
    for (const item of items) {
      const product =getProduct.get(item.product_id);
      const qty = Number (item.qty);
      if (!product || ! Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({error: "Invalid item"});        
      }
      lines.push({product, qty});    
    }

    const total = Math.round(lines.reduce((s, l) => s + l.product.price * l.qty, 0)* 100) / 100;

    const placeOrder =db.transaction(()=>{
      const order = db
      .prepare("INSERT INTO orders (customer_name, email, total) VALUES (?, ?, ?)")
      .run(customer_name, email, total);
      const insertItem = db.prepare(
        "INSERT INTO order_items (order_id, product_id, name, price, qty) VALUES(?,?,?,?,?)"
      );
      for (const l of lines) {
        insertItem.run(order.lastInsertRowid, l.product.id, l.product.name, l.product.price, l.qty);        
      }
      return order.lastInsertRowid;
    });
    const orderId = placeOrder();
    res.status(201).json({ id: Number (orderId), total });
  });

  app.get("/api/orders", requireAdmin, (req,res) => {
    const orders= db.prepare(
      `SELECT o.*, COALESCE(SUM(oi.qty), 0) AS item_count
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      GROUP BY o.id
      ORDER BY o.id DESC`
    )
    .all();
    res.json(orders);
  });

  app.get("/api/orders/:id", requireAdmin, (req, res) => {
    const orders = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id);
    if (!orders) return res.status(404).json({ error: "Not found"});
    const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(req.params.id);
    res.json({ ...order, items});
  });

  app.use((err, req, res, next) => {
    console.error("server error:", err.message);
    res.status(500).json({ error: err.message});
  });

app.listen(3001, () => console.log("API running on http://localhost:3001"));
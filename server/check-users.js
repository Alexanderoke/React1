const Database =require ("better-sqlite3");
const bcrypt =require("bcryptjs");

const db = new Database("shop.db");

const users =db.prepare("SELECT id, name, email, role FROM users").all();
console.log("Users in database:", users.length);
for(const u of users){
  console.log(u.id, JSON.stringify(u.email), u.role);
}

const[email,password] = process.argv.slice(2);
if (email && password){
  const u = db.prepare("SELECT * FROM users WHERE email =?").get(email.trim().toLocaleLowerCase());
  console.log(
    u
      ? "Found. Password matches: " + bcrypt.compareSync(password, u.password_hash)
      :"No user with that email"
  );
}
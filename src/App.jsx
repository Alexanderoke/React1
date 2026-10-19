import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import ProductDetail from "./ProductDetail";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Login from "./login";
import RequireAdmin from "./RequireAdmin";
import AdminLayout from "./AdminLayout";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import "./App.css";

function App() {
  const {count} = useCart();
  const { user, logout} =useAuth();
  return (
    <div className="app">
      <header className = "header">
        <h1><Link to="/">My Shop</Link></h1>
        <nav className="top-nav">
          <Link to="/cart">cart ({count})</Link>
          {user?.role === "admin" && <Link to="/admin">Admin</Link>}
          {user ? (
            <>
            <span>{user.name}</span>
            <button onClick={logout}>Log out</button>
            </>
          ) :(
            <Link to="/login">Log in</Link>
          )}
          
        </nav>
        
      </header>  
       <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/products/:id" element={<ProductDetail />} />
         <Route path="/cart" element={<Cart/>}/>
         <Route path="/checkout" element={<Checkout/>}/>
         <Route path="/login" element={<Login/>}/>
        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
            <Route index element={<AdminProducts/>} />
            <Route path="orders" element={<AdminOrders/>}/>
         </Route>
       </Routes>
     </div>
   );
}

export default App;
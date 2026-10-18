import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import ProductDetail from "./ProductDetail";
import Cart from "./Cart";
import Checkout from "./Checkout";
import AdminLayout from "./AdminLayout";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import { useCart } from "./CartContext";
import "./App.css";

function App() {
  const {count} = useCart();
  return (
    <div className="app">
      <header className = "header">
        <h1><Link to="/">My Shop</Link></h1>
        <nav className="top-nav">
          <Link to="/cart">cart ({count})</Link>
          <Link to="/admin">Admin</Link>
        </nav>
        
      </header>  
       <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/products/:id" element={<ProductDetail />} />
         <Route path="/cart" element={<Cart/>}/>
         <Route path="/checkout" element={<Checkout/>}/>
         <Route path="/admin" element={<AdminLayout/>}>
            <Route index element={<AdminProducts/>} />
            <Route path="orders" element={<AdminOrders/>}/>
         </Route>
       </Routes>
     </div>
   );
}

export default App;
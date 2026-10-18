import { NavLink, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div>
      <h2>Admin</h2>
      <nav className="admin-nav">
        <NavLink to="/admin" end>Products</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
      </nav>
      <Outlet/>
    </div>
  );
}

export default AdminLayout;
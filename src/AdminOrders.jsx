import { Fragment, useState, useEffect } from "react";

const API = "http://localhost:3001/api/orders";

function formatDate(sqlDate) {
  return new Date(sqlDate.replace(" ", "T") + "Z").toLocaleString();
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [details, setDetails] = useState({});

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  async function toggle(id) {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    if (!details[id]) {
      const res = await fetch(`${API}/${id}`);
      const data = await res.json();
      setDetails((current) => ({ ...current, [id]: data }));
    }
  }

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  if (loading) return <p>Loading...</p>;
  if (orders.length === 0) return <p>No orders yet.</p>;

  return (
    <div>
      <p>
        {orders.length} order(s), revenue <strong>${revenue.toFixed(2)}</strong>
      </p>
      <table className="orders">
        <thead>
          <tr>
            <th>#</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <Fragment key={o.id}>
              <tr className="order-row" onClick={() => toggle(o.id)}>
                <td>{o.id}</td>
                <td>{o.customer_name}<br /><small>{o.email}</small></td>
                <td>{o.item_count}</td>
                <td>${o.total.toFixed(2)}</td>
                <td>{formatDate(o.created_at)}</td>
              </tr>
              {openId === o.id && (
                <tr>
                  <td colSpan="5">
                    {details[o.id] ? (
                      <ul>
                        {details[o.id].items.map((i) => (
                          <li key={i.id}>
                            {i.qty} x {i.name} at ${i.price.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "Loading..."
                    )}
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrders;
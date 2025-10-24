import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]); // <-- State for orders
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // --- 1. Fetch User Data ---
    const fetchUserData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/user', {
          headers: { 'x-auth-token': token },
        });
        if (!res.ok) throw new Error('Failed to fetch user');
        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        console.error(error);
        handleLogout(); // Log out if token is invalid
      }
    };

    // --- 2. Fetch User's Past Orders ---
    const fetchOrders = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/orders/myorders', {
                headers: { 'x-auth-token': token },
            });
            if (!res.ok) throw new Error('Failed to fetch orders');
            const ordersData = await res.json();
            setOrders(ordersData);
        } catch (error) {
            console.error(error);
        }
    };

    const loadProfile = async () => {
        setLoading(true);
        await Promise.all([fetchUserData(), fetchOrders()]);
        setLoading(false);
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };
  
  const handleDownloadBill = (orderId) => {
    window.open(`http://localhost:5000/api/orders/bill/${orderId}`);
  };


  if (loading) {
    return <div>Loading your profile...</div>;
  }

  return (
    <div>
        <div className="card" style={{ maxWidth: '800px', margin: '50px auto' }}>
            <h2>Your Profile</h2>
            {user && (
                <div style={{ marginTop: '20px', lineHeight: '1.8' }}>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            )}
             <button onClick={handleLogout} className="btn secondary" style={{marginTop: '20px'}}>
                Logout
            </button>
        </div>

        <div className="card" style={{ maxWidth: '800px', margin: '30px auto' }}>
            <h2>Your Previous Orders</h2>
            {orders.length > 0 ? (
                orders.map(order => (
                    <div key={order._id} style={{ borderBottom: '1px solid var(--border-color)', padding: '15px 0' }}>
                        <p><strong>Order ID:</strong> {order._id}</p>
                        <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                        <p><strong>Total:</strong> ₹{order.totalCost.toFixed(2)}</p>
                        <ul>
                            {order.items.map(item => (
                                <li key={item._id}>{item.name} (x{item.quantity})</li>
                            ))}
                        </ul>
                        <button onClick={() => handleDownloadBill(order._id)} className="btn primary" style={{marginTop: '10px'}}>
                           Download Bill
                        </button>
                    </div>
                ))
            ) : (
                <p>You have no previous orders.</p>
            )}
        </div>
    </div>
  );
}
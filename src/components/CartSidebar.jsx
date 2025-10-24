import React from "react";
import { Link } from "react-router-dom";

export default function CartSidebar({cart = []}){
  // Note: Assuming 'qty' is 'quantity' from CartContext
  const total = cart.reduce((s, item) => s + item.price * (item.quantity || 1), 0);
  
  return (
    <aside className="card">
      <h3>Order Summary</h3>
      {cart.length === 0 ? <p className="muted">Your cart is empty.</p> :
        <ul>
          {cart.map(i => <li key={i.id}>{i.name} × {i.quantity || 1} — ₹{(i.price * (i.quantity||1)).toFixed(2)}</li>)}
        </ul>
      }
      <div style={{marginTop:12}}><strong>Total: ₹{total.toFixed(2)}</strong></div>
      <div style={{marginTop:12}}>
        {/* Links to the CheckoutPage */}
        <Link to="/checkout" className="btn primary" disabled={cart.length === 0}>
          Proceed to Checkout
        </Link>
      </div>
    </aside>
  );
}
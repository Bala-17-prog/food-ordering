import React from "react";

export default function OrderSummary({order}){
  if(!order) return <div className="card muted">No recent orders.</div>;
  return (
    <div className="card">
      <h3>Order #{order.id}</h3>
      <div className="muted">Status: {order.status}</div>
      <ul>
        {order.items.map(it => <li key={it.id}>{it.name} × {it.qty}</li>)}
      </ul>
    </div>
  );
}
import React, {useState} from "react";

export default function CheckoutForm({onSubmit}){
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  
  return (
    <form className="card" onSubmit={(e)=>{e.preventDefault(); onSubmit?.({name,address});}}>
      <h3>Checkout</h3>
      <label className="muted">Full name</label>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Recipient name" required />
      <label className="muted">Delivery address</label>
      <textarea value={address} onChange={e=>setAddress(e.target.value)} placeholder="Street, City, PIN" required />
      <div style={{marginTop:10}}><button className="btn primary">Place Order</button></div>
    </form>
  );
}
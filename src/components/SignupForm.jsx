import React, { useState } from "react";

export default function SignupForm({ onSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignup({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
      <input 
        value={name} 
        onChange={e => setName(e.target.value)} 
        placeholder="Full Name" 
        required
        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
      />
      <input 
        type="email"
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        placeholder="Email" 
        required 
        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
      />
      <input 
        type="password"
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        placeholder="Password" 
        required 
        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
      />
      <button type="submit" className="btn primary">Create Account</button>
    </form>
  );
}
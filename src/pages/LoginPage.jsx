import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // --- 1. HANDLER FOR TRADITIONAL LOGIN ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Login failed');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/'; // Redirect and refresh to update header
    } catch (err) {
      setError(err.message);
    }
  };

  // --- 2. HANDLER FOR GOOGLE LOGIN ---
  const handleGoogleLogin = () => {
    // This will redirect the browser to your backend's Google auth route
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="card" style={{ maxWidth: '450px', margin: '50px auto' }}>
      <h2>Login or Sign Up</h2>
      <p style={{ color: 'var(--secondary-text)', marginBottom: '20px' }}>
        Start your food journey with us
      </p>

      {/* --- GOOGLE SIGN-IN BUTTON --- */}
      <button 
        onClick={handleGoogleLogin} 
        className="btn" 
        style={{
          width: '100%', 
          background: '#4285F4', 
          color: 'white', 
          marginBottom: '15px'
        }}>
        Continue with Google
      </button>

      <p style={{textAlign: 'center', fontWeight: 'bold', color: 'var(--secondary-text)'}}>OR</p>

      {/* --- EMAIL/PASSWORD FORM --- */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
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

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <button type="submit" className="btn primary">
          Login with Email
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Don’t have an account? <Link to="/signup" style={{ color: 'var(--accent-red)' }}>Sign up</Link>
      </p>
    </div>
  );
}
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SignupForm from '../components/SignupForm.jsx';

export default function SignupPage() {
  const navigate = useNavigate();

  // Handler for traditional email/password signup
  const handleSignup = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.msg || 'Failed to sign up');
      }
      alert('Account created successfully! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Signup Error:', error);
      alert(error.message);
    }
  };

  // Handler for Google signup/login
  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="card" style={{ maxWidth: '450px', margin: '50px auto' }}>
      <h2>Create an Account</h2>
      <p style={{ color: 'var(--secondary-text)', marginBottom: '20px' }}>
        Join us and start ordering today!
      </p>

      {/* --- GOOGLE SIGN-UP BUTTON --- */}
      <button 
        onClick={handleGoogleSignup} 
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
      <SignupForm onSignup={handleSignup} />

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--accent-red)' }}>Login</Link>
      </p>
    </div>
  );
}
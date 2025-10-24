// src/pages/AuthCallbackPage.jsx
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');

    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', decodeURIComponent(user));
      // Redirect to home page after storing credentials
      window.location.href = '/';
    } else {
      // Handle error or redirect to login
      window.location.href = '/login';
    }
  }, [searchParams]);

  return <div>Loading...</div>;
}
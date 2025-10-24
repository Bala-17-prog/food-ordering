import React from "react";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from './context/CartContext';

// Import Shared Components
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

// Import Page Components
import Home from "./pages/Home.jsx";
import CartPage from "./pages/CartPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ProfilePage from './pages/ProfilePage.jsx';
import AuthCallbackPage from './pages/AuthCallbackPage.jsx';
import DietPlannerPage from './pages/DietPlannerPage.jsx';

export default function App() {
  return (
    <CartProvider>
      <div className="app-root">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Main Application Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/diet-planner" element={<DietPlannerPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
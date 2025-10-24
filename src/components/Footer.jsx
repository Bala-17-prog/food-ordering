import React from "react";

export default function Footer(){
  return (
    <footer className="footer card">
      <div>© {new Date().getFullYear()} Food Ordering System — Reliable food delivery & ordering.</div>
    </footer>
  );
}
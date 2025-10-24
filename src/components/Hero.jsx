import React from "react";
import { Link } from "react-router-dom";

export default function Hero(){
  return (
    <section className="card hero fade-in" aria-labelledby="hero-title">
      <h1 id="hero-title">Professional food ordering — streamlined for success.</h1>
      <p className="muted">Curated menus, secure checkout, and reliable order management for customers and restaurants.</p>
      <div style={{marginTop:12}}>
        <Link to="/menu" className="btn primary">View Menu</Link>
        <Link to="/about" className="btn ghost" style={{marginLeft:10}}>Learn More</Link>
      </div>
    </section>
  );
}
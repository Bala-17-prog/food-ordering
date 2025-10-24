import React, {useState} from "react";

export default function LoginForm({onLogin}){
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  return (
    <form className="card" onSubmit={(e)=>{e.preventDefault(); onLogin?.({email});}}>
      <h3>Sign in</h3>
      <label className="muted">Email</label>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" />
      <label className="muted">Password</label>
      <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="••••••" />
      <div style={{marginTop:10}}><button className="btn primary">Sign in</button></div>
    </form>
  );
}
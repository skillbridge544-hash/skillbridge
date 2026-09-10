import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const DEMOS = [
  { label: "Talent Aminata", email: "aminata@demo.skillbridge" },
  { label: "Talent Koffi", email: "koffi@demo.skillbridge" },
  { label: "Entreprise Inov", email: "recrutement@inovcotonou.demo" },
  { label: "Mentor Jean", email: "jean@demo.skillbridge" },
];

export default function Login() {
  const { saveSession } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("aminata@demo.skillbridge");
  const [mot_de_passe, setPassword] = useState("Password123");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await api.login({ email, mot_de_passe });
      saveSession(data.token, data.user);
      navigate("/app");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page" style={{ maxWidth: 480 }}>
      <h1>Connexion</h1>
      <form className="card" onSubmit={onSubmit}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        <label>Mot de passe</label>
        <input value={mot_de_passe} onChange={(e) => setPassword(e.target.value)} type="password" required />
        {error && <p className="err">{error}</p>}
        <button className="btn btn-green" style={{ marginTop: 16 }} type="submit">Se connecter</button>
        <p className="muted">Pas encore de compte ? <Link to="/register">Inscription</Link></p>
      </form>
      <div className="demo" style={{ marginTop: 16 }}>
        <strong>Comptes démo</strong> — mot de passe <code>Password123</code>
        <div className="row" style={{ marginTop: 8 }}>
          {DEMOS.map((d) => (
            <button key={d.email} type="button" className="btn btn-ghost" onClick={() => setEmail(d.email)}>
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

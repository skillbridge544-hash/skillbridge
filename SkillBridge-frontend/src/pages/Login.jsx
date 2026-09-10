import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const DEMOS = [
  { label: "Aminata · talent", email: "aminata@demo.skillbridge" },
  { label: "Koffi · data", email: "koffi@demo.skillbridge" },
  { label: "Inov · entreprise", email: "recrutement@inovcotonou.demo" },
  { label: "Jean · mentor", email: "jean@demo.skillbridge" },
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
    <div className="auth-split">
      <aside className="auth-brand">
        <div>
          <img src="/brand/logo-stacked.png" alt="SkillBridge" />
          <p style={{ textAlign: "center", color: "#c9d6e8", marginTop: 18 }}>
            Connecte tes preuves aux bonnes opportunités.
          </p>
        </div>
      </aside>
      <div className="auth-form">
        <div className="box">
          <h1>Bon retour</h1>
          <p className="muted">Connecte-toi pour voir tes matchs et ton Skill Passport.</p>
          <form className="card" onSubmit={onSubmit}>
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            <label>Mot de passe</label>
            <input value={mot_de_passe} onChange={(e) => setPassword(e.target.value)} type="password" required />
            {error && <p className="err">{error}</p>}
            <button className="btn btn-green" style={{ marginTop: 16, width: "100%" }} type="submit">Entrer</button>
            <p className="muted">Pas encore de compte ? <Link to="/register">Inscription</Link></p>
          </form>
          <div className="demo" style={{ marginTop: 16 }}>
            <strong>Jury / démo</strong> — mot de passe <code>Password123</code>
            <div className="row" style={{ marginTop: 8 }}>
              {DEMOS.map((d) => (
                <button key={d.email} type="button" className="btn btn-ghost" onClick={() => setEmail(d.email)}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

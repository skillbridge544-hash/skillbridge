import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { saveSession } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: "", email: "", mot_de_passe: "", role: "talent" });
  const [error, setError] = useState("");

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await api.register(form);
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
          <p style={{ textAlign: "center", color: "#c9d6e8", marginTop: 18, maxWidth: 360 }}>
            Un compte, un rôle, un Passport. Tu peux commencer en moins d’une minute.
          </p>
        </div>
      </aside>
      <div className="auth-form">
        <div className="box">
          <h1>Rejoindre le pont</h1>
          <form className="card" onSubmit={onSubmit}>
            <label>Nom complet</label>
            <input value={form.nom} onChange={(e) => set("nom", e.target.value)} required placeholder="Aminata Diallo" />
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
            <label>Mot de passe (8 caractères min.)</label>
            <input type="password" value={form.mot_de_passe} onChange={(e) => set("mot_de_passe", e.target.value)} required minLength={8} />
            <label>Je m’inscris en tant que</label>
            <select value={form.role} onChange={(e) => set("role", e.target.value)}>
              <option value="talent">Talent — je cherche des opportunités</option>
              <option value="mentor">Mentor — j’accompagne</option>
              <option value="entreprise">Entreprise — je publie des besoins</option>
            </select>
            {error && <p className="err">{error}</p>}
            <button className="btn btn-green" style={{ marginTop: 16, width: "100%" }} type="submit">Créer mon Skill Passport</button>
            <p className="muted">Déjà inscrit ? <Link to="/login">Connexion</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
}

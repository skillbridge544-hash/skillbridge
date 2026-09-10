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
    <div className="page" style={{ maxWidth: 520 }}>
      <h1>Créer un compte</h1>
      <form className="card" onSubmit={onSubmit}>
        <label>Nom</label>
        <input value={form.nom} onChange={(e) => set("nom", e.target.value)} required />
        <label>Email</label>
        <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
        <label>Mot de passe (8 caractères min.)</label>
        <input type="password" value={form.mot_de_passe} onChange={(e) => set("mot_de_passe", e.target.value)} required minLength={8} />
        <label>Je suis</label>
        <select value={form.role} onChange={(e) => set("role", e.target.value)}>
          <option value="talent">Talent</option>
          <option value="mentor">Mentor</option>
          <option value="entreprise">Entreprise</option>
        </select>
        {error && <p className="err">{error}</p>}
        <button className="btn btn-green" style={{ marginTop: 16 }} type="submit">Créer mon Skill Passport</button>
        <p className="muted">Déjà inscrit ? <Link to="/login">Connexion</Link></p>
      </form>
    </div>
  );
}

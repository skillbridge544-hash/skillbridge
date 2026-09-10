import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const NIVEAUX = ["debutant", "intermediaire", "avance", "expert"];

export default function Passport() {
  const { user, refresh } = useAuth();
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ nom_competence: "", niveau: "intermediaire", domaine: "Site web" });
  const [error, setError] = useState("");

  async function load() {
    const list = await api.skills(user.id);
    setSkills(list);
  }

  useEffect(() => {
    load().catch(() => {});
  }, [user.id]);

  async function add(e) {
    e.preventDefault();
    setError("");
    try {
      await api.addSkill(form);
      setForm((f) => ({ ...f, nom_competence: "" }));
      await load();
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    await api.deleteSkill(id);
    await load();
  }

  const publicUrl = `${window.location.origin}/passport/${user.identifiant_skillbridge}`;

  return (
    <div className="page">
      <h1>Mon Skill Passport</h1>
      <p className="muted">Lien public : <a href={`/passport/${user.identifiant_skillbridge}`}>{publicUrl}</a></p>

      <div className="grid-2">
        <form className="card" onSubmit={add}>
          <h3>Ajouter une compétence</h3>
          <label>Nom</label>
          <input value={form.nom_competence} onChange={(e) => setForm({ ...form, nom_competence: e.target.value })} required />
          <label>Niveau</label>
          <select value={form.niveau} onChange={(e) => setForm({ ...form, niveau: e.target.value })}>
            {NIVEAUX.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <label>Domaine</label>
          <input value={form.domaine} onChange={(e) => setForm({ ...form, domaine: e.target.value })} />
          {error && <p className="err">{error}</p>}
          <button className="btn btn-green" style={{ marginTop: 12 }} type="submit">Ajouter</button>
        </form>
        <div className="card">
          <h3>Compétences déclarées</h3>
          <div className="list">
            {skills.map((s) => (
              <div key={s.id} className="row" style={{ justifyContent: "space-between" }}>
                <div>
                  <strong>{s.nom_competence}</strong>
                  <div className="muted">{s.niveau} · {s.domaine || "—"}</div>
                </div>
                <button type="button" className="btn btn-danger" onClick={() => remove(s.id)}>Supprimer</button>
              </div>
            ))}
            {skills.length === 0 && <p className="muted">Aucune compétence pour l&apos;instant.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

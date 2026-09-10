import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({
    titre: "",
    description: "",
    role: "",
    contexte: "personnel",
    competences_utilisees: [],
    medias: [{ type: "lien", url: "" }],
  });
  const [error, setError] = useState("");

  async function load() {
    const [p, s] = await Promise.all([api.projects(user.id), api.skills(user.id)]);
    setProjects(p);
    setSkills(s);
  }

  useEffect(() => {
    load().catch(() => {});
  }, [user.id]);

  function toggleSkill(id) {
    setForm((f) => ({
      ...f,
      competences_utilisees: f.competences_utilisees.includes(id)
        ? f.competences_utilisees.filter((x) => x !== id)
        : [...f.competences_utilisees, id],
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const medias = form.medias.filter((m) => m.url);
      await api.addProject({ ...form, medias });
      setForm({ titre: "", description: "", role: "", contexte: "personnel", competences_utilisees: [], medias: [{ type: "lien", url: "" }] });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    await api.deleteProject(id);
    await load();
  }

  return (
    <div className="page">
      <h1>Mes projets</h1>
      <div className="grid-2">
        <form className="card" onSubmit={onSubmit}>
          <h3>Ajouter un projet</h3>
          <label>Titre</label>
          <input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} required />
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <label>Rôle</label>
          <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          <label>Contexte</label>
          <select value={form.contexte} onChange={(e) => setForm({ ...form, contexte: e.target.value })}>
            <option value="academique">Académique</option>
            <option value="professionnel">Professionnel</option>
            <option value="personnel">Personnel</option>
          </select>
          <label>Compétences utilisées</label>
          <div className="row">
            {skills.map((s) => (
              <button
                key={s.id}
                type="button"
                className={form.competences_utilisees.includes(s.id) ? "btn btn-green" : "btn btn-ghost"}
                onClick={() => toggleSkill(s.id)}
              >
                {s.nom_competence}
              </button>
            ))}
          </div>
          <label>Lien (GitHub, démo…)</label>
          <input value={form.medias[0].url} onChange={(e) => setForm({ ...form, medias: [{ type: "lien", url: e.target.value }] })} />
          {error && <p className="err">{error}</p>}
          <button className="btn btn-navy" style={{ marginTop: 12 }} type="submit">Enregistrer</button>
        </form>
        <div className="list">
          {projects.map((p) => (
            <article key={p.id} className="card">
              <h3>{p.titre}</h3>
              <p>{p.description}</p>
              <div className="row">
                {(p.competences_utilisees || []).map((s) => <span key={s.id} className="badge">{s.nom_competence}</span>)}
              </div>
              <button type="button" className="btn btn-danger" style={{ marginTop: 10 }} onClick={() => remove(p.id)}>Supprimer</button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

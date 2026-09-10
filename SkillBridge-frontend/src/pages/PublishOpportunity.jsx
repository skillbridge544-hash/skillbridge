import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

const DOMAINES = ["Site web", "Application mobile", "Design graphique", "Analyse de données", "Rédaction/Contenu"];

export default function PublishOpportunity() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titre: "",
    type: "emploi",
    description: "",
    domaine_general: "Site web",
    niveau_attendu: "intermediaire",
    competences_requises: [],
    mode: "standard",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.suggestions(form.domaine_general).then(setSuggestions).catch(() => setSuggestions([]));
  }, [form.domaine_general]);

  function toggle(id) {
    setForm((f) => ({
      ...f,
      competences_requises: f.competences_requises.includes(id)
        ? f.competences_requises.filter((x) => x !== id)
        : [...f.competences_requises, id],
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const created = await api.createOpportunity({
        ...form,
        mode: form.competences_requises.length ? "standard" : "generique",
      });
      navigate(`/app/opportunites/${created.id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <h1>Publier une opportunité</h1>
      <form className="card" onSubmit={onSubmit}>
        <label>Titre</label>
        <input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} required />
        <label>Type</label>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="emploi">Emploi</option>
          <option value="stage">Stage</option>
          <option value="mission">Mission</option>
          <option value="collaboration">Collaboration</option>
        </select>
        <label>Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <label>Domaine</label>
        <select value={form.domaine_general} onChange={(e) => setForm({ ...form, domaine_general: e.target.value })}>
          {DOMAINES.map((d) => <option key={d}>{d}</option>)}
        </select>
        <label>Niveau attendu</label>
        <select value={form.niveau_attendu} onChange={(e) => setForm({ ...form, niveau_attendu: e.target.value })}>
          <option value="debutant">Débutant</option>
          <option value="intermediaire">Intermédiaire</option>
          <option value="avance">Avancé</option>
          <option value="expert">Expert</option>
        </select>
        <label>Compétences suggérées</label>
        <div className="row">
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              className={form.competences_requises.includes(s.id) ? "btn btn-green" : "btn btn-ghost"}
              onClick={() => toggle(s.id)}
            >
              {s.nom_competence}
            </button>
          ))}
        </div>
        {error && <p className="err">{error}</p>}
        <button className="btn btn-green" style={{ marginTop: 14 }} type="submit">Publier</button>
      </form>
    </div>
  );
}

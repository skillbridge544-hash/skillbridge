import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";

export default function PublicPassport() {
  const { identifiant } = useParams();
  const [profil, setProfil] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.passport(identifiant).then(setProfil).catch((e) => setError(e.message));
  }, [identifiant]);

  if (error) return <div className="page"><p className="err">{error}</p></div>;
  if (!profil) return <div className="page">Chargement…</div>;

  return (
    <div className="page">
      <section className="banner">
        <img className="avatar" src={profil.photo_url || "/brand/logo-icon.png"} alt="" />
        <div>
          <div className="tag" style={{ color: "#9be05a" }}>Skill Passport public</div>
          <h1>{profil.nom}</h1>
          <p style={{ color: "#c9d6e8", margin: 0 }}>{profil.localisation} · @{profil.identifiant_skillbridge}</p>
        </div>
      </section>
      <article className="card" style={{ marginBottom: 18 }}>
        <p>{profil.bio || "Ce talent n’a pas encore rédigé sa bio."}</p>
      </article>
      <h2>Compétences</h2>
      <div className="row" style={{ marginBottom: 24 }}>
        {(profil.skills || []).map((s) => (
          <span key={s.id} className="badge">{s.nom_competence} · {s.niveau}</span>
        ))}
      </div>
      <h2>Preuves / projets</h2>
      <div className="grid-2">
        {(profil.projects || []).map((p) => (
          <article key={p.id} className="card">
            <h3>{p.titre}</h3>
            <p>{p.description}</p>
            <p className="muted">{p.role} · {p.contexte}</p>
            <div className="row">
              {(p.competences_utilisees || []).map((s) => <span key={s.id} className="badge">{s.nom_competence}</span>)}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

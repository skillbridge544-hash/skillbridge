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
      <div className="card" style={{ display: "flex", gap: 20, alignItems: "center" }}>
        {profil.photo_url && <img src={profil.photo_url} alt="" width="84" height="84" style={{ borderRadius: "50%" }} />}
        <div>
          <h1>{profil.nom}</h1>
          <p className="muted">{profil.localisation} · @{profil.identifiant_skillbridge}</p>
          <p>{profil.bio}</p>
        </div>
      </div>
      <h2 style={{ marginTop: 24 }}>Compétences</h2>
      <div className="row">
        {(profil.skills || []).map((s) => (
          <span key={s.id} className="badge">{s.nom_competence} · {s.niveau}</span>
        ))}
      </div>
      <h2 style={{ marginTop: 24 }}>Preuves / projets</h2>
      <div className="list">
        {(profil.projects || []).map((p) => (
          <article key={p.id} className="card">
            <h3>{p.titre}</h3>
            <p>{p.description}</p>
            <p className="muted">{p.role} · {p.contexte}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

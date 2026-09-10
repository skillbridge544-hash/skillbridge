import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function OpportunityDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [opp, setOpp] = useState(null);
  const [match, setMatch] = useState(null);

  useEffect(() => {
    api.opportunity(id).then(setOpp).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (user && user.role !== "entreprise") {
      api.match(id, user.id).then(setMatch).catch(() => setMatch(null));
    }
  }, [id, user]);

  if (!opp) return <div className="page">Chargement…</div>;

  return (
    <div className="page">
      <section className="banner">
        <div>
          <span className="badge">{opp.type}</span>
          <h1 style={{ marginTop: 10 }}>{opp.titre}</h1>
          <p style={{ color: "#c9d6e8", margin: 0 }}>
            {opp.entreprise?.nom_entreprise || opp.entreprise?.nom} · {opp.domaine_general || "Domaine libre"} · niveau {opp.niveau_attendu || "—"}
          </p>
        </div>
      </section>
      <div className="grid-2">
        <article className="card">
          <h3>Le besoin</h3>
          <p>{opp.description}</p>
          <h3>Compétences recherchées</h3>
          <div className="row">
            {(opp.competences_requises || []).map((s) => <span key={s.id} className="badge">{s.nom_competence}</span>)}
          </div>
        </article>
        {match && (
          <article className="card">
            <h3>Votre matching</h3>
            <p className="muted">Le score n’est jamais affiché seul : voici pourquoi.</p>
            <div className={`score ${match.score >= 70 ? "" : match.score >= 40 ? "mid" : "low"}`}>{match.score}%</div>
            <p style={{ marginTop: 16 }}><strong>Tu as déjà</strong></p>
            <div className="row">
              {match.correspondances.map((c) => <span key={c} className="badge">✓ {c}</span>)}
              {match.correspondances.length === 0 && <span className="muted">Aucune correspondance encore.</span>}
            </div>
            <p style={{ marginTop: 12 }}><strong>À renforcer</strong></p>
            <div className="row">
              {match.manquantes.map((c) => <span key={c} className="badge gold">{c}</span>)}
              {match.manquantes.length === 0 && <span className="ok">Profil aligné à 100%.</span>}
            </div>
            {opp.entreprise_id && (
              <Link className="btn btn-navy" style={{ marginTop: 18 }} to={`/app/messages/${[user.id, opp.entreprise_id].sort().join("_")}`}>
                Contacter l&apos;entreprise
              </Link>
            )}
          </article>
        )}
      </div>
    </div>
  );
}

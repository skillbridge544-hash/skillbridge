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
      <h1>{opp.titre}</h1>
      <p className="muted">{opp.type} · niveau {opp.niveau_attendu || "—"} · {opp.entreprise?.nom_entreprise || opp.entreprise?.nom}</p>
      <div className="grid-2">
        <article className="card">
          <p>{opp.description}</p>
          <h3>Compétences recherchées</h3>
          <div className="row">
            {(opp.competences_requises || []).map((s) => <span key={s.id} className="badge">{s.nom_competence}</span>)}
          </div>
        </article>
        {match && (
          <article className="card">
            <h3>Votre matching</h3>
            <div className={`score ${match.score >= 70 ? "" : match.score >= 40 ? "mid" : "low"}`}>{match.score}%</div>
            <p className="ok">Correspondances : {match.correspondances.join(", ") || "—"}</p>
            <p className="err">À renforcer : {match.manquantes.join(", ") || "—"}</p>
            {opp.entreprise_id && (
              <Link className="btn btn-navy" to={`/app/messages/${[user.id, opp.entreprise_id].sort().join("_")}`}>
                Contacter l&apos;entreprise
              </Link>
            )}
          </article>
        )}
      </div>
    </div>
  );
}

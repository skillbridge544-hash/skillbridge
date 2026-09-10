import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Opportunities() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [type, setType] = useState("");

  useEffect(() => {
    const q = type ? `?type=${type}` : "";
    api.opportunities(q).then(setList).catch(() => setList([]));
  }, [type]);

  return (
    <div className="page">
      <section className="banner">
        <div>
          <div className="tag" style={{ color: "#9be05a" }}>Marché</div>
          <h1>Opportunités ouvertes</h1>
          <p style={{ color: "#c9d6e8", margin: 0 }}>Chaque carte mène à un matching détaillé : correspondances et écarts.</p>
        </div>
        {user.role === "entreprise" && <Link className="btn btn-green" to="/app/publier">Publier une offre</Link>}
      </section>
      <div className="row" style={{ margin: "0 0 20px" }}>
        {["", "emploi", "stage", "mission", "collaboration"].map((t) => (
          <button key={t || "all"} type="button" className={type === t ? "btn btn-navy" : "btn btn-ghost"} onClick={() => setType(t)}>
            {t || "Toutes"}
          </button>
        ))}
      </div>
      <div className="list">
        {list.map((o) => (
          <Link key={o.id} className="card hoverable opp-card" to={`/app/opportunites/${o.id}`}>
            <div>
              <span className="badge navy">{o.type}</span>
              {o.domaine_general && <span className="badge" style={{ marginLeft: 8 }}>{o.domaine_general}</span>}
              <h3 style={{ marginTop: 10 }}>{o.titre}</h3>
              <p className="muted">{o.entreprise?.nom_entreprise || o.entreprise?.nom} · niveau {o.niveau_attendu || "ouvert"}</p>
              <div className="row">
                {(o.competences_requises || []).map((s) => <span key={s.id} className="badge">{s.nom_competence}</span>)}
              </div>
            </div>
            <span className="btn btn-green">Voir le match</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

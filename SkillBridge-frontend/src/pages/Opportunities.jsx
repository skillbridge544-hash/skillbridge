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
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1>Opportunités</h1>
        {user.role === "entreprise" && <Link className="btn btn-green" to="/app/publier">Publier</Link>}
      </div>
      <div className="row" style={{ margin: "12px 0 20px" }}>
        {["", "emploi", "stage", "mission", "collaboration"].map((t) => (
          <button key={t || "all"} type="button" className={type === t ? "btn btn-navy" : "btn btn-ghost"} onClick={() => setType(t)}>
            {t || "Toutes"}
          </button>
        ))}
      </div>
      <div className="list">
        {list.map((o) => (
          <Link key={o.id} className="card" to={`/app/opportunites/${o.id}`}>
            <h3>{o.titre}</h3>
            <p className="muted">{o.type} · {o.domaine_general || "—"} · {o.entreprise?.nom_entreprise || o.entreprise?.nom}</p>
            <div className="row">
              {(o.competences_requises || []).map((s) => <span key={s.id} className="badge">{s.nom_competence}</span>)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

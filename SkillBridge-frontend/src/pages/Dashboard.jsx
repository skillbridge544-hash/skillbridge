import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (user?.role !== "entreprise") {
      api.matches(user.id).then(setMatches).catch(() => setMatches([]));
    }
  }, [user]);

  return (
    <div className="page">
      <h1>Bonjour {user.nom}</h1>
      <p className="muted">Rôle : <span className="badge navy">{user.role}</span></p>

      <div className="grid-3" style={{ marginTop: 20 }}>
        <Link className="card" to="/app/profil"><h3>Mon profil</h3><p className="muted">Bio, photo, objectifs.</p></Link>
        {user.role !== "entreprise" && (
          <>
            <Link className="card" to="/app/passport"><h3>Skill Passport</h3><p className="muted">Compétences et lien public.</p></Link>
            <Link className="card" to="/app/projets"><h3>Mes preuves</h3><p className="muted">Projets contextualisés.</p></Link>
          </>
        )}
        <Link className="card" to="/app/opportunites"><h3>Opportunités</h3><p className="muted">Offres et matching.</p></Link>
        {user.role === "entreprise" && (
          <Link className="card" to="/app/publier"><h3>Publier</h3><p className="muted">Créer une opportunité.</p></Link>
        )}
        <Link className="card" to="/app/mentors"><h3>Mentors</h3><p className="muted">Demander un accompagnement.</p></Link>
      </div>

      {user.role !== "entreprise" && (
        <section style={{ marginTop: 28 }}>
          <h2>Mes meilleurs matchs</h2>
          <div className="list">
            {matches.slice(0, 3).map((m) => (
              <Link key={m.opportunity.id} className="card" to={`/app/opportunites/${m.opportunity.id}`}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div>
                    <h3>{m.opportunity.titre}</h3>
                    <p className="muted">{m.opportunity.type} · {m.correspondances.length} correspondance(s)</p>
                  </div>
                  <div className={`score ${m.score >= 70 ? "" : m.score >= 40 ? "mid" : "low"}`}>{m.score}%</div>
                </div>
              </Link>
            ))}
            {matches.length === 0 && <p className="muted">Aucun match pour le moment.</p>}
          </div>
        </section>
      )}
    </div>
  );
}

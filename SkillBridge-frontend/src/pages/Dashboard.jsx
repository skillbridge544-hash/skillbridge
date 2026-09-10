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

  const skillsCount = user.skills?.length || 0;
  const projectsCount = user.projects?.length || 0;
  const complete = [user.bio, user.photo_url, user.localisation].filter(Boolean).length;

  return (
    <div className="page">
      <section className="banner">
        <img className="avatar" src={user.photo_url || "/brand/logo-icon.png"} alt="" />
        <div>
          <div className="tag" style={{ color: "#9be05a" }}>Tableau de bord · {user.role}</div>
          <h1>Bonjour {user.nom.split(" ")[0]}</h1>
          <p style={{ color: "#c9d6e8", margin: 0 }}>
            {user.bio || "Complète ta bio pour apparaître plus crédible auprès des entreprises."}
          </p>
        </div>
      </section>

      <div className="stats" style={{ margin: "0 0 24px", width: "100%" }}>
        <div className="stat"><b>{complete}/3</b><span>profil (photo, bio, ville)</span></div>
        <div className="stat"><b>{skillsCount}</b><span>compétences</span></div>
        <div className="stat"><b>{projectsCount}</b><span>preuves / projets</span></div>
        <div className="stat"><b>{matches[0]?.score ?? "—"}</b><span>meilleur match</span></div>
      </div>

      <div className="grid-3">
        <Link className="card hoverable" to="/app/profil">
          <div className="icon-bubble navy">☺</div>
          <h3>Mon profil</h3>
          <p className="muted">Photo, objectifs, localisation.</p>
        </Link>
        {user.role !== "entreprise" && (
          <>
            <Link className="card hoverable" to="/app/passport">
              <div className="icon-bubble">★</div>
              <h3>Skill Passport</h3>
              <p className="muted">Lien public à partager.</p>
            </Link>
            <Link className="card hoverable" to="/app/projets">
              <div className="icon-bubble">▣</div>
              <h3>Mes preuves</h3>
              <p className="muted">Projets qui contextualisent tes skills.</p>
            </Link>
          </>
        )}
        <Link className="card hoverable" to="/app/opportunites">
          <div className="icon-bubble navy">→</div>
          <h3>Opportunités</h3>
          <p className="muted">Offres + score de correspondance.</p>
        </Link>
        {user.role === "entreprise" && (
          <Link className="card hoverable" to="/app/publier">
            <div className="icon-bubble">+</div>
            <h3>Publier une offre</h3>
            <p className="muted">Emploi, stage, mission…</p>
          </Link>
        )}
        <Link className="card hoverable" to="/app/mentors">
          <div className="icon-bubble">◎</div>
          <h3>Mentors</h3>
          <p className="muted">Demander un accompagnement.</p>
        </Link>
      </div>

      {user.role !== "entreprise" && (
        <section style={{ marginTop: 32 }}>
          <div className="section-title" style={{ marginTop: 8 }}>
            <small>Matching</small>
            <h2>Tes opportunités les plus proches</h2>
          </div>
          <div className="list">
            {matches.slice(0, 4).map((m) => (
              <Link key={m.opportunity.id} className="card hoverable opp-card" to={`/app/opportunites/${m.opportunity.id}`}>
                <div>
                  <span className="badge navy">{m.opportunity.type}</span>
                  <h3 style={{ marginTop: 8 }}>{m.opportunity.titre}</h3>
                  <p className="muted">{m.opportunity.entreprise?.nom_entreprise || m.opportunity.entreprise?.nom}</p>
                  <div className="row">
                    {m.correspondances.map((c) => <span key={c} className="badge">✓ {c}</span>)}
                    {m.manquantes.slice(0, 2).map((c) => <span key={c} className="badge gold">À renforcer · {c}</span>)}
                  </div>
                </div>
                <div className={`score ${m.score >= 70 ? "" : m.score >= 40 ? "mid" : "low"}`}>{m.score}%</div>
              </Link>
            ))}
            {matches.length === 0 && <div className="card muted">Ajoute des compétences pour voir tes matchs.</div>}
          </div>
        </section>
      )}
    </div>
  );
}

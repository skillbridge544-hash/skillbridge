import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Mentors() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.mentors().then(setMentors).catch(() => setMentors([]));
  }, []);

  async function demander(id) {
    setMsg("");
    try {
      await api.requestMentorship(id);
      setMsg("Demande envoyée. Le mentor peut l’accepter ou la refuser.");
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div className="page">
      <section className="banner">
        <div>
          <div className="tag" style={{ color: "#9be05a" }}>Accompagnement</div>
          <h1>Mentors disponibles</h1>
          <p style={{ color: "#c9d6e8", margin: 0 }}>La techno crée la connexion. Le mentorat crée la progression.</p>
        </div>
      </section>
      {msg && <p className="ok">{msg}</p>}
      <div className="grid-2">
        {mentors.map((m) => (
          <article key={m.id} className="card">
            <div className="row">
              <img className="avatar" src={m.photo_url || "/brand/logo-icon.png"} alt="" style={{ width: 56, height: 56 }} />
              <div>
                <h3 style={{ margin: 0 }}>{m.nom}</h3>
                <p className="muted" style={{ margin: 0 }}>{m.mentor_profile?.domaine_expertise}</p>
              </div>
            </div>
            <p style={{ marginTop: 12 }}>{m.bio}</p>
            <p className="muted">{m.mentor_profile?.experience} · {m.mentor_profile?.disponibilite}</p>
            <div className="row">
              {user.role === "talent" && (
                <button type="button" className="btn btn-green" onClick={() => demander(m.id)}>Demander un mentorat</button>
              )}
              <Link className="btn btn-ghost" to={`/app/messages/${[user.id, m.id].sort().join("_")}`}>Écrire</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

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
      setMsg("Demande envoyée.");
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div className="page">
      <h1>Mentors</h1>
      {msg && <p className="ok">{msg}</p>}
      <div className="list">
        {mentors.map((m) => (
          <article key={m.id} className="card">
            <h3>{m.nom}</h3>
            <p className="muted">{m.mentor_profile?.domaine_expertise} · {m.mentor_profile?.experience}</p>
            <p>{m.bio}</p>
            <div className="row">
              {user.role === "talent" && (
                <button type="button" className="btn btn-green" onClick={() => demander(m.id)}>Demander un mentorat</button>
              )}
              <Link className="btn btn-ghost" to={`/app/messages/${[user.id, m.id].sort().join("_")}`}>Message</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

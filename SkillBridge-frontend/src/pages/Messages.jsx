import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Messages() {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [contenu, setContenu] = useState("");
  const [error, setError] = useState("");

  const otherId = conversationId.split("_").find((id) => id !== user.id);

  async function load() {
    const list = await api.conversation(conversationId);
    setMessages(list);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [conversationId]);

  async function send(e) {
    e.preventDefault();
    setError("");
    try {
      await api.sendMessage({ destinataire_id: otherId, contenu });
      setContenu("");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <h1>Messagerie</h1>
      <div className="card list">
        {messages.map((m) => (
          <div key={m.id} style={{ textAlign: m.expediteur_id === user.id ? "right" : "left" }}>
            <div className="badge">{m.contenu}</div>
            <div className="muted" style={{ fontSize: 12 }}>{new Date(m.date_envoi).toLocaleString()}</div>
          </div>
        ))}
        {messages.length === 0 && <p className="muted">Aucun message. Écris le premier.</p>}
      </div>
      <form className="row" onSubmit={send} style={{ marginTop: 12 }}>
        <input value={contenu} onChange={(e) => setContenu(e.target.value)} placeholder="Votre message" required />
        <button className="btn btn-green" type="submit">Envoyer</button>
      </form>
      {error && <p className="err">{error}</p>}
    </div>
  );
}

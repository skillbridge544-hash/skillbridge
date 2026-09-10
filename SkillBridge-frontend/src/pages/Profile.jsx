import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";

export default function Profile() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({
    photo_url: user.photo_url || "",
    bio: user.bio || "",
    localisation: user.localisation || "",
    objectifs: user.objectifs || "",
    disponibilite: user.disponibilite || "",
    nom_entreprise: user.nom_entreprise || "",
    secteur: user.secteur || "",
    domaine_expertise: user.mentor_profile?.domaine_expertise || "",
    experience: user.mentor_profile?.experience || "",
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      await api.patchMe(form);
      await refresh();
      setMsg("Profil enregistré.");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <h1>Mon profil</h1>
      <form className="card" onSubmit={onSubmit}>
        <label>Photo (URL)</label>
        <input value={form.photo_url} onChange={(e) => set("photo_url", e.target.value)} />
        <label>Bio</label>
        <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} maxLength={500} />
        <label>Localisation</label>
        <input value={form.localisation} onChange={(e) => set("localisation", e.target.value)} />
        {user.role !== "entreprise" && (
          <>
            <label>Objectifs</label>
            <input value={form.objectifs} onChange={(e) => set("objectifs", e.target.value)} />
            <label>Disponibilité</label>
            <input value={form.disponibilite} onChange={(e) => set("disponibilite", e.target.value)} />
          </>
        )}
        {user.role === "entreprise" && (
          <>
            <label>Nom de l&apos;entreprise</label>
            <input value={form.nom_entreprise} onChange={(e) => set("nom_entreprise", e.target.value)} />
            <label>Secteur</label>
            <input value={form.secteur} onChange={(e) => set("secteur", e.target.value)} />
          </>
        )}
        {user.role === "mentor" && (
          <>
            <label>Domaine d&apos;expertise</label>
            <input value={form.domaine_expertise} onChange={(e) => set("domaine_expertise", e.target.value)} />
            <label>Expérience</label>
            <input value={form.experience} onChange={(e) => set("experience", e.target.value)} />
          </>
        )}
        {msg && <p className="ok">{msg}</p>}
        {error && <p className="err">{error}</p>}
        <button className="btn btn-navy" style={{ marginTop: 14 }} type="submit">Enregistrer</button>
      </form>
    </div>
  );
}

import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="page">
      <section className="hero">
        <div>
          <div className="tag">Africa&apos;s Human Capital Infrastructure</div>
          <h1>Le pont entre les compétences et les opportunités.</h1>
          <p>
            Construis un Skill Passport avec des preuves concrètes, trouve un mentor,
            et découvre des opportunités avec un matching explicable.
          </p>
          <div className="row" style={{ marginTop: 20 }}>
            <Link className="btn btn-green" to="/register">Créer un compte</Link>
            <Link className="btn btn-ghost" to="/login" style={{ background: "#fff" }}>Se connecter</Link>
          </div>
        </div>
        <img className="hero-logo" src="/brand/logo-stacked.png" alt="SkillBridge" />
      </section>

      <div className="grid-3" style={{ marginTop: 28 }}>
        <article className="card">
          <h3>Talents</h3>
          <p className="muted">Déclare tes compétences, prouve-les par des projets, et vois ton score de matching.</p>
        </article>
        <article className="card">
          <h3>Mentors</h3>
          <p className="muted">Transmets ton expertise et accompagne la nouvelle génération.</p>
        </article>
        <article className="card">
          <h3>Entreprises</h3>
          <p className="muted">Publie une opportunité et identifie les profils réellement alignés.</p>
        </article>
      </div>
    </div>
  );
}

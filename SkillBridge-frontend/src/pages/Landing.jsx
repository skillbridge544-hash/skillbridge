import { Link } from "react-router-dom";

const STEPS = [
  ["Profil", "Inscription et rôle Talent, Mentor ou Entreprise."],
  ["Compétences", "Niveaux et domaines sur ton Skill Passport."],
  ["Preuves", "Projets réels, pas seulement un CV."],
  ["Mentorat", "Un expert qui t’oriente."],
  ["Opportunités", "Emplois, stages, missions."],
  ["Matching", "Un score expliqué, jamais un chiffre seul."],
];

export default function Landing() {
  return (
    <div className="page-wide">
      <section className="hero-bleed">
        <div className="hero-inner">
          <div>
            <div className="tag">Africa&apos;s Human Capital Infrastructure</div>
            <h1>Le pont entre les compétences et les opportunités.</h1>
            <p className="lead">
              SkillBridge relie talents, mentors et entreprises autour d’une identité
              professionnelle prouvée — le Skill Passport — et d’un matching lisible.
            </p>
            <div className="row" style={{ marginTop: 22 }}>
              <Link className="btn btn-green" to="/register">Créer mon Skill Passport</Link>
              <Link className="btn btn-ghost" to="/login">Se connecter</Link>
            </div>
          </div>
          <div className="hero-panel">
            <img src="/brand/logo-stacked.png" alt="SkillBridge" />
          </div>
        </div>
      </section>

      <div className="stats">
        <div className="stat"><b>3</b><span>types d’acteurs</span></div>
        <div className="stat"><b>100%</b><span>score explicable</span></div>
        <div className="stat"><b>1</b><span>Skill Passport public</span></div>
        <div className="stat"><b>24h</b><span>pensé hackathon, prêt démo</span></div>
      </div>

      <div className="page" style={{ paddingTop: 48 }}>
        <div className="section-title">
          <small>Pour qui</small>
          <h2>Un écosystème, trois ponts</h2>
        </div>
        <div className="grid-3">
          <article className="card">
            <div className="icon-bubble">★</div>
            <h3>Talents</h3>
            <p className="muted">Étudiants, diplômés, artisans, pros. Montre ce que tu sais faire avec des preuves, pas un PDF figé.</p>
            <Link className="btn btn-green" to="/register">Je suis talent</Link>
          </article>
          <article className="card">
            <div className="icon-bubble navy">◎</div>
            <h3>Mentors</h3>
            <p className="muted">Transmets ton expertise, accepte des demandes, et construis une réputation d’accompagnateur.</p>
            <Link className="btn btn-navy" to="/register">Je suis mentor</Link>
          </article>
          <article className="card">
            <div className="icon-bubble">▣</div>
            <h3>Entreprises</h3>
            <p className="muted">Publie un besoin précis. SkillBridge te propose des profils avec un score et le détail des écarts.</p>
            <Link className="btn btn-ghost" to="/register">Je recrute</Link>
          </article>
        </div>

        <div className="section-title">
          <small>Parcours</small>
          <h2>De la compétence à l’opportunité</h2>
        </div>
        <div className="grid-3">
          {STEPS.map(([title, text], i) => (
            <div className="step" key={title}>
              <div className="step-num">{i + 1}</div>
              <div>
                <strong>{title}</strong>
                <div className="muted">{text}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-title">
          <small>Le moment démo</small>
          <h2>Un matching qu’on peut expliquer</h2>
        </div>
        <div className="match-demo">
          <div className="score light">92%</div>
          <div>
            <h3>Aminata × Développeur Frontend React</h3>
            <p>Pas un algorithme boîte noire : chaque point vient d’une compétence en commun.</p>
            <div className="row">
              <span className="pill-ok">✓ React</span>
              <span className="pill-ok">✓ JavaScript</span>
              <span className="pill-ok">✓ HTML/CSS</span>
              <span className="pill-ko">PostgreSQL à renforcer</span>
            </div>
            <div className="row" style={{ marginTop: 16 }}>
              <Link className="btn btn-green" to="/login">Voir la démo (Aminata)</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

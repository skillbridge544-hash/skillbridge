import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="nav">
      <NavLink to={user ? "/app" : "/"}>
        <img className="logo" src="/brand/logo-horizontal.png" alt="SkillBridge" />
      </NavLink>
      <nav className="nav-links">
        {!user && (
          <>
            <NavLink to="/login">Connexion</NavLink>
            <NavLink to="/register" className="btn btn-green">Créer un compte</NavLink>
          </>
        )}
        {user && (
          <>
            <NavLink to="/app" end>Accueil</NavLink>
            {user.role !== "entreprise" && <NavLink to="/app/passport">Passport</NavLink>}
            {user.role !== "entreprise" && <NavLink to="/app/projets">Projets</NavLink>}
            <NavLink to="/app/opportunites">Opportunités</NavLink>
            <NavLink to="/app/mentors">Mentors</NavLink>
            <span className="who">{user.nom}</span>
            <button
              className="link"
              type="button"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Sortir
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page">Chargement…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

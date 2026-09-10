import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("sb_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(!!localStorage.getItem("sb_token"));

  useEffect(() => {
    const token = localStorage.getItem("sb_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then((me) => {
        setUser(me);
        localStorage.setItem("sb_user", JSON.stringify(me));
      })
      .catch(() => {
        localStorage.removeItem("sb_token");
        localStorage.removeItem("sb_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  function saveSession(token, nextUser) {
    localStorage.setItem("sb_token", token);
    localStorage.setItem("sb_user", JSON.stringify(nextUser));
    setUser(nextUser);
  }

  async function refresh() {
    const me = await api.me();
    localStorage.setItem("sb_user", JSON.stringify(me));
    setUser(me);
    return me;
  }

  function logout() {
    localStorage.removeItem("sb_token");
    localStorage.removeItem("sb_user");
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loading, saveSession, refresh, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

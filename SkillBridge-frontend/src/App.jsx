import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Protected from "./components/Protected";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Passport from "./pages/Passport";
import PublicPassport from "./pages/PublicPassport";
import Projects from "./pages/Projects";
import Opportunities from "./pages/Opportunities";
import OpportunityDetail from "./pages/OpportunityDetail";
import PublishOpportunity from "./pages/PublishOpportunity";
import Mentors from "./pages/Mentors";
import Messages from "./pages/Messages";

function Shell({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Shell>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/passport/:identifiant" element={<PublicPassport />} />
            <Route
              path="/app"
              element={<Protected><Dashboard /></Protected>}
            />
            <Route path="/app/profil" element={<Protected><Profile /></Protected>} />
            <Route path="/app/passport" element={<Protected><Passport /></Protected>} />
            <Route path="/app/projets" element={<Protected><Projects /></Protected>} />
            <Route path="/app/opportunites" element={<Protected><Opportunities /></Protected>} />
            <Route path="/app/opportunites/:id" element={<Protected><OpportunityDetail /></Protected>} />
            <Route path="/app/publier" element={<Protected><PublishOpportunity /></Protected>} />
            <Route path="/app/mentors" element={<Protected><Mentors /></Protected>} />
            <Route path="/app/messages/:conversationId" element={<Protected><Messages /></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Shell>
      </BrowserRouter>
    </AuthProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { ViewType } from './types/platform';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SkeletonLoader } from './components/SkeletonLoader';
import { AppShell } from './components/AppShell';

import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { TalentsView } from './views/TalentsView';
import { MentorsView } from './views/MentorsView';
import { CompaniesView } from './views/CompaniesView';
import { ResourcesView } from './views/ResourcesView';
import { ChallengesView } from './views/ChallengesView';
import { PassportView } from './views/PassportView';
import { VerificationView } from './views/VerificationView';
import { CertificatesView } from './views/CertificatesView';
import { AuthView } from './views/AuthView';
import { OnboardingView } from './views/OnboardingView';
import { ContactView } from './views/ContactView';
import { TermsView } from './views/TermsView';
import { PrivacyView } from './views/PrivacyView';
import { LearnView } from './views/LearnView';
import { LearnDetailView } from './views/LearnDetailView';
import { LessonPlayerView } from './views/LessonPlayerView';
import { MentorStudioView } from './views/MentorStudioView';
import { MentorProfileView } from './views/MentorProfileView';
import { ExplorerView } from "./views/ExplorerView";
import { MessagingView } from "./views/MessagingView";
import { SkillExchangeView } from "./views/SkillExchangeView";
import { ProjectPublishView } from "./views/ProjectPublishView";
import { OpportunitiesView } from "./views/OpportunitiesView";
import { AdminAuthView } from "./views/AdminAuthView";
import { AdminDashboardView } from "./views/AdminDashboardView";
import { PublicProfileView } from "./views/PublicProfileView";
import { PublicPassportVerificationView } from "./views/PublicPassportVerificationView";
import { FavoritesView } from "./views/FavoritesView";
import { TalentDashboard } from './components/dashboard/talent/TalentDashboard';
import { MentorDashboard } from './components/dashboard/mentor/MentorDashboard';
import { CompanyDashboard } from './components/dashboard/company/CompanyDashboard';


import { PageTransition } from './components/motion/PageTransition';

export const App: React.FC = () => {
  const { user, profile, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [verifyCertId, setVerifyCertId] = useState<string | undefined>(undefined);

  const getRoleDefaultDashboard = (): ViewType => {
    if (profile?.account_type === 'company') return 'dashboard-company';
    if (profile?.account_type === 'mentor') return 'dashboard-mentor';
    return 'dashboard-talent';
  };

  // Parse URL hash for direct certificate verification (e.g. #verify?cert=SB-CERT-...)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#verify')) {
        const queryParams = new URLSearchParams(hash.split('?')[1] || '');
        const cert = queryParams.get('cert');
        if (cert) {
          setVerifyCertId(cert);
          setCurrentView('verify');
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Auto navigate to dashboard when user logs in if on home or auth view
  useEffect(() => {
    if (user && (currentView === 'home' || currentView === 'auth')) {
      setCurrentView(getRoleDefaultDashboard());
    }
  }, [user, profile?.account_type]);

  // When user logs out, return to public home view
  useEffect(() => {
    if (!user && (currentView === 'dashboard-talent' || currentView === 'dashboard-mentor' || currentView === 'dashboard-company' || currentView === 'mentor-studio')) {
      setCurrentView('home');
    }
  }, [user, currentView]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // While checking session
  if (isLoading) {
    return <SkeletonLoader />;
  }

  const handleNavigate = (view: ViewType) => {
    if (view !== 'verify') {
      setVerifyCertId(undefined);
    }
    setCurrentView(view);
  };

  const handleVerifyCertificate = (certId: string) => {
    setVerifyCertId(certId);
    setCurrentView('verify');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            onNavigate={handleNavigate}
            
            isAuthenticated={Boolean(user)}
          />
        );
      case 'about':
        return <AboutView onNavigate={handleNavigate} />;
      case 'talents':
        return <TalentsView onNavigate={handleNavigate} />;
      case 'mentors':
        return <MentorsView onNavigate={handleNavigate} />;
      case 'companies':
        return <CompaniesView onNavigate={handleNavigate} />;
      case 'resources':
        return <ResourcesView onNavigate={handleNavigate} />;
      case 'challenges':
        return <ChallengesView onNavigate={handleNavigate} />;
      case 'learn':
        return <LearnView onNavigate={handleNavigate} />;
      case 'learn-detail':
        return <LearnDetailView onNavigate={handleNavigate} />;
      case 'lesson-player':
        return <LessonPlayerView onNavigate={handleNavigate} />;
      case 'mentor-studio':
        return <MentorStudioView onNavigate={handleNavigate} />;
      case 'mentor-profile':
        return <MentorProfileView onNavigate={handleNavigate} />;
      case 'certificates':
        return (
          <CertificatesView
            onNavigate={handleNavigate}
            onVerifyCertificate={handleVerifyCertificate}
          />
        );
      case 'passport':
        return (
          <PassportView
            onNavigate={handleNavigate}
            
          />
        );
      case 'verify':
        return (
          <VerificationView
            certificateId={verifyCertId}
            onNavigate={handleNavigate}
          />
        );
      case 'auth':
        return (
          <AuthView 
            onSuccess={() => handleNavigate('dashboard-talent')}
          />
        );
      case "explorer": return <ExplorerView onNavigate={handleNavigate} />;
      case "messaging": return <MessagingView onNavigate={handleNavigate} />;
      case "skill-exchange": return <SkillExchangeView onNavigate={handleNavigate} />;
      case "project-publish": return <ProjectPublishView onNavigate={handleNavigate} />;
      case "opportunities": return <OpportunitiesView onNavigate={handleNavigate} />;
      case "admin-auth": return <AdminAuthView onNavigate={handleNavigate} />;
      case "admin-dashboard": return <AdminDashboardView onNavigate={handleNavigate} />;
      case 'public-profile':
        return <PublicProfileView onNavigate={handleNavigate} />;
      case 'public-passport':
        return <PublicPassportVerificationView onNavigate={handleNavigate} passportId={verifyCertId} />;
      case "favorites": return <FavoritesView onNavigate={handleNavigate} />;
      case 'onboarding':
        return <OnboardingView onNavigate={handleNavigate} />;
      case 'dashboard-talent':
        return (
          <TalentDashboard
            onNavigate={handleNavigate}
            onRoleSwitch={(role) => {
              if (role === 'company') setCurrentView('dashboard-company');
              else if (role === 'mentor') setCurrentView('dashboard-mentor');
              else setCurrentView('dashboard-talent');
            }}
          />
        );
      case 'dashboard-mentor':
        return (
          <MentorDashboard
            onNavigate={handleNavigate}
            onRoleSwitch={(role) => {
              if (role === 'company') setCurrentView('dashboard-company');
              else if (role === 'mentor') setCurrentView('dashboard-mentor');
              else setCurrentView('dashboard-talent');
            }}
          />
        );
      case 'dashboard-company':
        return (
          <CompanyDashboard
            onNavigate={handleNavigate}
            onRoleSwitch={(role) => {
              if (role === 'company') setCurrentView('dashboard-company');
              else if (role === 'mentor') setCurrentView('dashboard-mentor');
              else setCurrentView('dashboard-talent');
            }}
          />
        );
      case 'contact':
        return <ContactView onNavigate={handleNavigate} />;
      case 'terms':
        return <TermsView onNavigate={handleNavigate} />;
      case 'privacy':
        return <PrivacyView onNavigate={handleNavigate} />;
      case 'application':
        return <OpportunitiesView onNavigate={handleNavigate} />;
      case 'admin-programs':
        return <AdminDashboardView onNavigate={handleNavigate} />;
      default:
        return (
          <HomeView
            onNavigate={handleNavigate}
            
            isAuthenticated={Boolean(user)}
          />
        );
    }
  };

  // 1. CONNECTED EXPERIENCE (Separated Universe - No Public Navbar or Footer)
  if (user) {
    return (
      <AppShell currentView={currentView} onNavigate={handleNavigate}>
        <PageTransition pageKey={currentView}>
          {renderView()}
        </PageTransition>
      </AppShell>
    );
  }

  // 2. PUBLIC EXPERIENCE (Marketing Showcase with Public Navbar & Footer)
  return (
    <div className="min-h-screen bg-[#F5F7F6] text-[#101820] flex flex-col font-sans selection:bg-[#59B83E] selection:text-white">
      {/* Public Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Main Content Router */}
      <main className="flex-1 w-full flex flex-col">
        <PageTransition pageKey={currentView}>
          {renderView()}
        </PageTransition>
      </main>

      {/* Public Footer */}
      <Footer
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default App;

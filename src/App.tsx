import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { ViewType } from './types/platform';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
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

const PRIVATE_VIEWS: ViewType[] = [
  'dashboard-talent',
  'dashboard-mentor',
  'dashboard-company',
  'mentor-studio',
  'passport',
  'messaging',
  'favorites',
  'project-publish',
  'skill-exchange',
  'admin-dashboard',
];

const safeGetStorage = (key: string): string | null => {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage.getItem(key);
    }
  } catch {
    // Gracefully handle iframe security restrictions
  }
  return null;
};

const safeSetStorage = (key: string, value: string): void => {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(key, value);
    }
  } catch {
    // Gracefully handle iframe security restrictions
  }
};

const resolveInitialView = (): { view: ViewType; authTab: 'login' | 'register' } => {
  try {
    const hash = typeof window !== 'undefined' && window.location.hash
      ? window.location.hash.replace(/^#\/?/, '')
      : '';
    const stored = safeGetStorage('sb_current_view');
    const raw = hash || stored || '';

    if (raw.startsWith('verify')) return { view: 'verify', authTab: 'login' };
    if (raw === 'login' || raw === 'auth') return { view: 'auth', authTab: 'login' };
    if (raw === 'register') return { view: 'auth', authTab: 'register' };
    if (raw === 'dashboard' || raw === 'dashboard-talent') return { view: 'dashboard-talent', authTab: 'login' };
    if (raw === 'dashboard-mentor') return { view: 'dashboard-mentor', authTab: 'login' };
    if (raw === 'dashboard-company') return { view: 'dashboard-company', authTab: 'login' };
    if (raw === 'passport') return { view: 'passport', authTab: 'login' };
    if (raw === 'messages' || raw === 'messaging') return { view: 'messaging', authTab: 'login' };
    if (raw === 'explorer') return { view: 'explorer', authTab: 'login' };
    if (raw === 'learn') return { view: 'learn', authTab: 'login' };
    if (raw === 'opportunities') return { view: 'opportunities', authTab: 'login' };
    if (raw === 'certificates') return { view: 'certificates', authTab: 'login' };
    if (raw === 'onboarding') return { view: 'onboarding', authTab: 'login' };
    if (raw === 'about') return { view: 'about', authTab: 'login' };
    if (raw === 'talents') return { view: 'talents', authTab: 'login' };
    if (raw === 'mentors') return { view: 'mentors', authTab: 'login' };
    if (raw === 'companies') return { view: 'companies', authTab: 'login' };
    if (raw === 'resources') return { view: 'resources', authTab: 'login' };
    if (raw === 'challenges') return { view: 'challenges', authTab: 'login' };
    if (raw === 'terms') return { view: 'terms', authTab: 'login' };
    if (raw === 'privacy') return { view: 'privacy', authTab: 'login' };
    if (raw === 'contact') return { view: 'contact', authTab: 'login' };
    if (raw === 'admin' || raw === 'admin-auth') return { view: 'admin-auth', authTab: 'login' };
    if (raw === 'admin-dashboard') return { view: 'admin-dashboard', authTab: 'login' };
  } catch {
    // Fallback to home on any parse failure
  }
  return { view: 'home', authTab: 'login' };
};

export const App: React.FC = () => {
  const { user, profile, isLoading } = useAuth();
  const initial = resolveInitialView();
  const [currentView, setCurrentView] = useState<ViewType>(initial.view);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>(initial.authTab);
  const [verifyCertId, setVerifyCertId] = useState<string | undefined>(undefined);

  const getRoleDefaultDashboard = (roleOverride?: 'talent' | 'mentor' | 'company'): ViewType => {
    const role = roleOverride || profile?.account_type || (user?.user_metadata as any)?.account_type;
    if (role === 'company') return 'dashboard-company';
    if (role === 'mentor') return 'dashboard-mentor';
    return 'dashboard-talent';
  };

  // Sync auth state changes with route security
  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // Non-connected user accessing private page -> redirect to login
      if (PRIVATE_VIEWS.includes(currentView)) {
        setCurrentView('auth');
        setAuthInitialTab('login');
        safeSetStorage('sb_current_view', 'auth');
      }
    } else {
      // Connected user accessing login/register -> redirect to existing role dashboard
      if (currentView === 'auth' || currentView === 'admin-auth') {
        const dest = getRoleDefaultDashboard();
        setCurrentView(dest);
        safeSetStorage('sb_current_view', dest);
      }
    }
  }, [user, isLoading, profile?.account_type, currentView]);

  // Parse URL hash for direct certificate verification or deep links
  useEffect(() => {
    const handleHashChange = () => {
      try {
        const hash = window.location.hash ? window.location.hash.replace(/^#\/?/, '') : '';
        if (hash.startsWith('verify')) {
          const queryParams = new URLSearchParams(hash.split('?')[1] || '');
          const cert = queryParams.get('cert');
          if (cert) {
            setVerifyCertId(cert);
            setCurrentView('verify');
          }
          return;
        }

        if (hash === 'login') {
          if (user) {
            setCurrentView(getRoleDefaultDashboard());
          } else {
            setAuthInitialTab('login');
            setCurrentView('auth');
          }
          return;
        }

        if (hash === 'register') {
          if (user) {
            setCurrentView(getRoleDefaultDashboard());
          } else {
            setAuthInitialTab('register');
            setCurrentView('auth');
          }
          return;
        }

        if (hash) {
          const resolved = resolveInitialView();
          if (!user && PRIVATE_VIEWS.includes(resolved.view)) {
            setAuthInitialTab('login');
            setCurrentView('auth');
          } else {
            setCurrentView(resolved.view);
          }
        }
      } catch {
        // Ignore hash change errors
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user, profile]);

  // Scroll to top on view change
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // ignore
    }
  }, [currentView]);

  const handleNavigate = (view: ViewType, options?: { authTab?: 'login' | 'register' }) => {
    if (options?.authTab) {
      setAuthInitialTab(options.authTab);
    }

    if (view !== 'verify') {
      setVerifyCertId(undefined);
    }

    // Protection 1: Non-connected user attempting private route -> /login
    if (!user && PRIVATE_VIEWS.includes(view)) {
      setCurrentView('auth');
      setAuthInitialTab('login');
      safeSetStorage('sb_current_view', 'auth');
      return;
    }

    // Protection 2: Already connected user trying to view login/register -> redirect to role dashboard
    if (user && (view === 'auth' || view === 'admin-auth')) {
      const dest = getRoleDefaultDashboard();
      setCurrentView(dest);
      safeSetStorage('sb_current_view', dest);
      return;
    }

    setCurrentView(view);
    safeSetStorage('sb_current_view', view);

    try {
      if (view === 'home') {
        if (window.location.hash && window.location.hash !== '#') {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } else {
        window.location.hash = view;
      }
    } catch {
      // Ignore URL hash/history errors in iframe
    }
  };

  const handleAuthSuccess = (role?: 'talent' | 'mentor' | 'company') => {
    const dest = getRoleDefaultDashboard(role);
    handleNavigate(dest);
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
            initialTab={authInitialTab}
            onSuccess={handleAuthSuccess}
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

  // 1. CONNECTED WORKSPACE (Sidebar navigation, no public marketing navbar/footer)
  const isWorkspaceView = Boolean(user && PRIVATE_VIEWS.includes(currentView));

  if (isWorkspaceView) {
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

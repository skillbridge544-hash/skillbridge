import React, { useState } from 'react';
import { ViewType } from '../types/platform';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { AppSidebar } from './AppSidebar';
import { NotificationsModal } from './NotificationsModal';
import { ProfileModal } from './ProfileModal';
import { UserAvatar } from './UserAvatar';
import { FaIcon } from './FaIcon';
import { Sun, Moon } from 'lucide-react';
import { 
  faHouse, 
  faGraduationCap, 
  faCompass, 
  faShieldHalved, 
  faBell,
  faComments
} from '@fortawesome/free-solid-svg-icons';

import { SkillBridgeLogo } from './SkillBridgeLogo';

interface AppShellProps {
  children: React.ReactNode;
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  currentView,
  onNavigate
}) => {
  const { profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const unreadNotificationsCount = 2;

  const defaultDashboardView: ViewType = 
    profile?.account_type === 'company' 
      ? 'dashboard-company' 
      : profile?.account_type === 'mentor' 
      ? 'dashboard-mentor' 
      : 'dashboard-talent';

  const isViewActive = (navKey: string): boolean => {
    switch (navKey) {
      case 'dashboard':
        return currentView === 'dashboard-talent' || currentView === 'dashboard-mentor' || currentView === 'dashboard-company';
      case 'learn':
        return currentView === 'learn' || currentView === 'learn-detail' || currentView === 'lesson-player' || currentView === 'mentor-studio';
      case 'certificates':
        return currentView === 'certificates';
      case 'explore':
        return currentView === 'talents' || currentView === 'challenges' || currentView === 'mentors' || currentView === 'companies';
      case 'passport':
        return currentView === 'passport';
      default:
        return false;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7F6] text-[#101820] antialiased">
      {/* Desktop Sidebar */}
      <AppSidebar
        currentView={currentView}
        onNavigate={onNavigate}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        unreadNotificationsCount={2}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {/* Mobile Header Bar */}
        <header className="lg:hidden sticky top-0 z-40 bg-[#FAFCFB]/95 backdrop-blur-md border-b border-[#E2E8E5] px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate(defaultDashboardView)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <SkillBridgeLogo size="sm" isDark={theme === 'dark'} />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2 py-1 rounded-xl text-[10px] font-mono font-bold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              {language.toUpperCase()}
            </button>

            <button
              type="button"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <FaIcon icon={faBell} className="text-xs" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#68A91B] sb-pulse-dot" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="p-0.5 rounded-xl hover:ring-2 hover:ring-[#06234B]/20 transition-all cursor-pointer"
              aria-label="Mon Profil"
            >
              <UserAvatar profile={profile} size="xs" />
            </button>
          </div>
        </header>

        {/* Dynamic View Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8E5] px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => onNavigate(defaultDashboardView)}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
            isViewActive('dashboard') ? 'text-[#06234B] font-bold' : 'text-stone-500'
          }`}
        >
          <div className={`p-1.5 rounded-lg ${isViewActive('dashboard') ? 'bg-[#06234B] text-white shadow-2xs' : 'bg-transparent'}`}>
            <FaIcon icon={faHouse} className="text-xs" />
          </div>
          <span>Accueil</span>
        </button>

        {profile?.account_type === 'company' ? (
          <button
            type="button"
            onClick={() => onNavigate('opportunities')}
            className={`flex flex-col items-center gap-1 p-1 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
              currentView === 'opportunities' ? 'text-[#06234B] font-bold' : 'text-stone-500'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${currentView === 'opportunities' ? 'bg-[#06234B] text-white shadow-2xs' : 'bg-transparent'}`}>
              <FaIcon icon={faCompass} className="text-xs" />
            </div>
            <span>Offres</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate(profile?.account_type === 'mentor' ? 'talents' : 'project-publish')}
            className={`flex flex-col items-center gap-1 p-1 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
              currentView === 'talents' || currentView === 'project-publish' ? 'text-[#06234B] font-bold' : 'text-stone-500'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${currentView === 'talents' || currentView === 'project-publish' ? 'bg-[#06234B] text-white shadow-2xs' : 'bg-transparent'}`}>
              <FaIcon icon={faCompass} className="text-xs" />
            </div>
            <span>{profile?.account_type === 'mentor' ? 'Talents' : 'Projets'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onNavigate('messaging')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
            currentView === 'messaging' ? 'text-[#06234B] font-bold' : 'text-stone-500'
          }`}
        >
          <div className={`p-1.5 rounded-lg ${currentView === 'messaging' ? 'bg-[#06234B] text-white shadow-2xs' : 'bg-transparent'}`}>
            <FaIcon icon={faComments} className="text-xs" />
          </div>
          <span>Messages</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate(profile?.account_type === 'company' ? 'talents' : 'opportunities')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
            currentView === 'opportunities' || currentView === 'talents' ? 'text-[#06234B] font-bold' : 'text-stone-500'
          }`}
        >
          <div className={`p-1.5 rounded-lg ${currentView === 'opportunities' || currentView === 'talents' ? 'bg-[#06234B] text-white shadow-2xs' : 'bg-transparent'}`}>
            <FaIcon icon={faGraduationCap} className="text-xs" />
          </div>
          <span>{profile?.account_type === 'company' ? 'Talents' : 'Opportunités'}</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('passport')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
            isViewActive('passport') ? 'text-[#06234B] font-bold' : 'text-stone-500'
          }`}
        >
          <div className={`p-1.5 rounded-lg ${isViewActive('passport') ? 'bg-[#06234B] text-[#68A91B] shadow-2xs' : 'bg-transparent'}`}>
            <FaIcon icon={faShieldHalved} className="text-xs" />
          </div>
          <span>Passeport</span>
        </button>
      </nav>

      {/* Modals */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={onNavigate}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

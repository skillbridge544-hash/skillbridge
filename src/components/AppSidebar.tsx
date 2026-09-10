import React from 'react';
import { ViewType } from '../types/platform';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { UserAvatar } from './UserAvatar';
import { FaIcon } from './FaIcon';
import { SkillBridgeLogo } from './SkillBridgeLogo';
import { Sun, Moon } from 'lucide-react';
import { 
  faBell, 
  faArrowRightFromBracket, 
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import {
  TALENT_NAVIGATION,
  MENTOR_NAVIGATION,
  COMPANY_NAVIGATION,
  NavItemConfig,
} from '../config/navigation';

interface AppSidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onOpenNotifications: () => void;
  onOpenProfileModal: () => void;
  unreadNotificationsCount?: number;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentView,
  onNavigate,
  onOpenNotifications,
  onOpenProfileModal,
  unreadNotificationsCount = 0,
}) => {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  const accountType = profile?.account_type || 'talent';

  // Determine navigation items based on current user account type
  const getNavItems = (): NavItemConfig[] => {
    switch (accountType) {
      case 'mentor':
        return MENTOR_NAVIGATION;
      case 'company':
        return COMPANY_NAVIGATION;
      default:
        return TALENT_NAVIGATION;
    }
  };

  const navItems = getNavItems();

  const isItemActive = (item: NavItemConfig): boolean => {
    if (item.view) {
      return currentView === item.view;
    }
    return false;
  };

  const handleItemClick = (item: NavItemConfig) => {
    if (item.action) {
      switch (item.action) {
        case 'openProfile':
          onOpenProfileModal();
          return;
        case 'scrollToSkills': {
          const el = document.getElementById('talent-skills-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            onNavigate('dashboard-talent');
            setTimeout(() => {
              const target = document.getElementById('talent-skills-section');
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
          return;
        }
        case 'scrollToMatches': {
          const targetId = accountType === 'company' ? 'company-matching-section' : 'talent-matches-section';
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            onNavigate(accountType === 'company' ? 'dashboard-company' : 'dashboard-talent');
            setTimeout(() => {
              const target = document.getElementById(targetId);
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
          return;
        }
        case 'scrollToRequests': {
          const el = document.getElementById('mentor-requests-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            onNavigate('dashboard-mentor');
            setTimeout(() => {
              const target = document.getElementById('mentor-requests-section');
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
          return;
        }
        case 'openPublishModal': {
          const el = document.getElementById('company-opportunities-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            onNavigate('dashboard-company');
          }
          return;
        }
      }
    }

    if (item.view) {
      onNavigate(item.view);
    }
  };

  const displayName = profile?.first_name || profile?.last_name
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
    : user?.email?.split('@')[0] || 'Mon Compte';

  const userRole = profile?.account_type === 'mentor'
    ? 'Mentor & Formateur'
    : profile?.account_type === 'company'
    ? 'Organisation Entreprise'
    : 'Talent Vérifié';

  const defaultDashboardView: ViewType = 
    accountType === 'company' 
      ? 'dashboard-company' 
      : accountType === 'mentor' 
      ? 'dashboard-mentor' 
      : 'dashboard-talent';

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#FAFCFB] border-r border-[#E2E8E5] shrink-0 z-30 select-none">
      {/* Top Brand Area */}
      <div className="p-4 border-b border-[#E2E8E5]/70 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate(defaultDashboardView)}
          className="flex items-center group text-left cursor-pointer"
        >
          <SkillBridgeLogo size="sm" isDark={theme === 'dark'} />
        </button>

        {/* Global Quick Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-stone-500 hover:text-[#06234B] hover:bg-stone-100 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={toggleLanguage}
            className="px-1.5 py-1 rounded-lg text-[10px] font-mono font-bold text-stone-500 hover:text-[#06234B] hover:bg-stone-100 transition-colors cursor-pointer"
            title="Langue"
          >
            {language.toUpperCase()}
          </button>

          {/* Notifications Quick Trigger */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-lg text-stone-500 hover:text-[#06234B] hover:bg-stone-100 transition-colors cursor-pointer"
            title="Notifications"
            aria-label="Notifications"
          >
            <FaIcon icon={faBell} className="text-xs" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#68A91B] ring-2 ring-white sb-pulse-dot" />
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 flex items-center justify-between">
          <span>{accountType === 'company' ? 'Entreprise' : accountType === 'mentor' ? 'Espace Mentor' : 'Espace Talent'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#68A91B]"></span>
        </div>

        {navItems.map((item) => {
          const active = isItemActive(item);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all group cursor-pointer hover:translate-x-0.5 ${
                active
                  ? 'bg-white text-[#06234B] shadow-xs border border-[#E2E8E5] font-bold'
                  : 'text-stone-600 hover:text-[#06234B] hover:bg-white/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-xl transition-colors ${
                  active 
                    ? 'bg-[#06234B] text-white shadow-2xs' 
                    : 'bg-stone-100 text-stone-500 group-hover:text-[#06234B] group-hover:bg-stone-200/80'
                }`}>
                  <FaIcon icon={item.icon} className="text-xs" />
                </div>
                <span>{item.label}</span>
              </div>

              {item.highlight && (
                <span className="px-2 py-0.5 rounded-full bg-[#68A91B]/15 text-[#4F8214] text-[10px] font-mono font-bold">
                  Souverain
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom User Area */}
      <div className="p-3 m-3 rounded-2xl bg-white border border-[#E2E8E5] shadow-xs space-y-3">
        <div 
          onClick={onOpenProfileModal}
          className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-stone-50 transition-colors"
          title="Modifier mon profil"
        >
          <UserAvatar profile={profile} size="sm" showBorder />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-[#101820] truncate">
              {displayName}
            </div>
            <div className="text-[10px] text-stone-400 truncate">
              {userRole}
            </div>
          </div>
        </div>

        {/* Quick Action buttons */}
        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-stone-100">
          <button
            type="button"
            onClick={onOpenProfileModal}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-medium text-stone-600 hover:text-[#06234B] hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <FaIcon icon={faGear} className="text-stone-400 text-[11px]" />
            <span>Profil</span>
          </button>

          <button
            type="button"
            onClick={() => signOut()}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-medium text-stone-600 hover:text-rose-600 hover:bg-rose-50/50 transition-colors cursor-pointer"
            title="Se déconnecter"
          >
            <FaIcon icon={faArrowRightFromBracket} className="text-stone-400 text-[11px]" />
            <span>Quitter</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

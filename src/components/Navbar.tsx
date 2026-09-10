import React, { useState, useEffect } from 'react';
import { ViewType } from '../types/platform';
import { SkillBridgeLogo } from './SkillBridgeLogo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { UserAvatar } from './UserAvatar';
import { Menu, X, ArrowRight, Sun, Moon, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; view: ViewType }[] = [
    { label: t('nav.home'), view: 'home' },
    { label: t('nav.learn'), view: 'learn' },
    { label: t('nav.talents'), view: 'talents' },
    { label: t('nav.mentors'), view: 'mentors' },
    { label: t('nav.companies'), view: 'companies' },
    { label: t('nav.resources'), view: 'resources' },
  ];

  const handleNav = (v: ViewType) => {
    onNavigate(v);
    setMobileMenuOpen(false);
  };

  const userDashboardView: ViewType = 
    profile?.account_type === 'company'
      ? 'dashboard-company'
      : profile?.account_type === 'mentor'
      ? 'dashboard-mentor'
      : 'dashboard-talent';

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E2E8E5] py-3.5' 
          : 'bg-[#F5F7F6]/90 backdrop-blur-sm border-b border-stone-200/60 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav('home')}
          className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <SkillBridgeLogo size="md" isDark={theme === 'dark'} />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#101820]/80">
          {navLinks.map((link) => {
            const isActive = currentView === link.view;
            return (
              <button
                key={link.view}
                type="button"
                onClick={() => handleNav(link.view)}
                className={`transition-colors cursor-pointer py-1 relative ${
                  isActive 
                    ? 'text-[#123B5D] font-bold' 
                    : 'hover:text-[#123B5D]'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span 
                    layoutId="activeNavTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#59B83E] rounded-full" 
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions & Global Utilities */}
        <div className="hidden lg:flex items-center gap-3">
          
          {/* Language Switcher Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="sb-btn px-2.5 py-1.5 rounded-xl border border-[#E2E8E5] bg-white text-xs font-mono font-bold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title={language === 'fr' ? 'Passer en Anglais' : 'Switch to French'}
          >
            <Globe className="w-3.5 h-3.5 text-[#59B83E]" />
            <span className="uppercase">{language}</span>
          </button>

          {/* Dark / Light Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="sb-btn p-2 rounded-xl border border-[#E2E8E5] bg-white text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer shadow-2xs"
            title={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#123B5D]" />
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3 ml-1">
              <button
                type="button"
                onClick={() => handleNav('passport')}
                className={`sb-btn px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'passport'
                    ? 'bg-[#123B5D] text-white shadow-xs'
                    : 'bg-white border border-[#E2E8E5] text-[#123B5D] hover:bg-stone-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#59B83E] sb-pulse-dot" />
                <span>{t('nav.passport')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleNav(userDashboardView)}
                className="sb-btn p-1.5 pr-3 rounded-xl border border-[#E2E8E5] bg-white text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
                title="Mon Espace"
              >
                <UserAvatar profile={profile} size="xs" />
                <span className="text-xs font-bold font-mono">
                  {profile?.first_name || 'Espace'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => signOut()}
                className="text-xs text-stone-400 hover:text-rose-600 transition-colors font-medium cursor-pointer"
              >
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              <button
                type="button"
                onClick={() => handleNav('auth')}
                className="sb-btn px-3.5 py-2 rounded-xl text-xs font-bold text-[#123B5D] hover:bg-stone-100 transition-colors cursor-pointer"
              >
                {t('nav.login')}
              </button>

              <button
                type="button"
                onClick={() => handleNav('onboarding')}
                className="sb-btn px-4 py-2.5 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer group"
              >
                <span>{t('nav.join')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C8F169] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Controls & Hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          
          {/* Quick Theme Switch Mobile */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white border border-[#E2E8E5] text-stone-700 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#123B5D]" />}
          </button>

          {/* Quick Language Switch Mobile */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2 py-1.5 rounded-xl bg-white border border-[#E2E8E5] text-[11px] font-mono font-bold text-stone-700 cursor-pointer"
          >
            {language.toUpperCase()}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white border border-[#E2E8E5] text-[#101820] hover:bg-stone-100 cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="overflow-hidden lg:hidden border-b border-[#E2E8E5] bg-white px-6 py-6 space-y-4"
          >
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = currentView === link.view;
                return (
                  <button
                    key={link.view}
                    type="button"
                    onClick={() => handleNav(link.view)}
                    className={`text-left text-sm font-semibold py-2 px-3 rounded-lg transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#F5F7F6] text-[#123B5D] font-bold' 
                        : 'text-[#101820]/80 hover:bg-stone-50'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#E2E8E5] flex flex-col gap-3">
              {user ? (
                <button
                  type="button"
                  onClick={() => handleNav(userDashboardView)}
                  className="sb-btn w-full py-2.5 rounded-xl bg-[#123B5D] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserAvatar profile={profile} size="xs" />
                  <span>{t('nav.dashboard')}</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleNav('auth')}
                    className="sb-btn w-full py-2.5 rounded-xl bg-white border border-[#E2E8E5] text-[#123B5D] font-bold text-xs cursor-pointer"
                  >
                    {t('nav.login')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('onboarding')}
                    className="sb-btn w-full py-2.5 rounded-xl bg-[#123B5D] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t('nav.join')}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C8F169]" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

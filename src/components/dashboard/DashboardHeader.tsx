import React from 'react';
import { Profile } from '../../types';
import { UserAvatar } from '../UserAvatar';
import { FaIcon } from '../FaIcon';
import { faShieldHalved, faUserCheck, faBriefcase, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

interface DashboardHeaderProps {
  greeting: string;
  subtitle: string;
  profile: Profile | null;
  roleLabel: string;
  roleType: 'talent' | 'mentor' | 'company';
  completionPercentage?: number;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  onRoleSwitch?: (role: 'talent' | 'mentor' | 'company') => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  greeting,
  subtitle,
  profile,
  roleLabel,
  roleType,
  completionPercentage,
  primaryAction,
  secondaryAction,
  onRoleSwitch,
}) => {
  const getRoleIcon = () => {
    switch (roleType) {
      case 'mentor':
        return faChalkboardTeacher;
      case 'company':
        return faBriefcase;
      default:
        return faUserCheck;
    }
  };

  const sbid = profile?.passport_id || (profile?.id ? `SB-${profile.id.slice(0, 8).toUpperCase()}` : 'SB-24-TALENT');

  return (
    <div className="bg-white border-b border-[#E2E8E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Top Switcher Bar (Demo/Hackathon Helper) */}
        {onRoleSwitch && (
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-[#F7F8F3] border border-[#E2E8E5] px-3.5 py-2 rounded-xl">
            <span className="text-[#5C6B78] font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#68A91B] animate-pulse"></span>
              Perspective de démonstration :
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onRoleSwitch('talent')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  roleType === 'talent'
                    ? 'bg-[#06234B] text-white'
                    : 'text-[#06234B] hover:bg-white'
                }`}
              >
                Talent
              </button>
              <button
                type="button"
                onClick={() => onRoleSwitch('mentor')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  roleType === 'mentor'
                    ? 'bg-[#06234B] text-white'
                    : 'text-[#06234B] hover:bg-white'
                }`}
              >
                Mentor
              </button>
              <button
                type="button"
                onClick={() => onRoleSwitch('company')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  roleType === 'company'
                    ? 'bg-[#06234B] text-white'
                    : 'text-[#06234B] hover:bg-white'
                }`}
              >
                Entreprise
              </button>
            </div>
          </div>
        )}

        {/* Main Header Content */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Identity Info */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <UserAvatar profile={profile} size="xl" className="border-2 border-[#DFE5D2] shadow-sm" />
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#68A91B] text-white flex items-center justify-center border-2 border-white shadow-xs"
                title={roleLabel}
              >
                <FaIcon icon={getRoleIcon()} className="text-[10px]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#06234B] tracking-tight">
                  {greeting}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF6E0] text-[#4F8214] border border-[#D7E8BC]">
                  <FaIcon icon={faShieldHalved} className="text-[10px]" />
                  {roleLabel}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#5C6B78] max-w-xl font-normal leading-relaxed">
                {subtitle}
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-[#5C6B78]">
                <span className="font-mono bg-[#F7F8F3] px-2 py-0.5 rounded border border-[#E2E8E5] text-[#06234B] font-semibold">
                  ID: {sbid}
                </span>
                {profile?.location && (
                  <span>
                    📍 {profile.location}
                    {profile.country ? `, ${profile.country}` : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions & Completion */}
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center md:items-end lg:items-center gap-3 shrink-0">
            {typeof completionPercentage === 'number' && (
              <div className="bg-[#F7F8F3] border border-[#E2E8E5] p-3 rounded-xl min-w-[200px]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[#5C6B78] font-medium">Complétion du profil</span>
                  <span className="font-bold text-[#06234B]">{completionPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-[#E2E8E5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#68A91B] transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(10, completionPercentage))}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              {secondaryAction && (
                <button
                  type="button"
                  onClick={secondaryAction.onClick}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[#E2E8E5] hover:bg-[#F7F8F3] text-xs sm:text-sm font-semibold text-[#06234B] transition-colors cursor-pointer text-center"
                >
                  {secondaryAction.label}
                </button>
              )}

              {primaryAction && (
                <button
                  type="button"
                  onClick={primaryAction.onClick}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#68A91B] hover:bg-[#4F8214] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer text-center"
                >
                  {primaryAction.label}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

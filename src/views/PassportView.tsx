import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ViewType } from '../types/platform';
import { FaIcon } from '../components/FaIcon';
import { 
  faDownload, 
  faShareNodes,
  faEdit,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { SkillPassport } from '../components/SkillPassport';
import { SkillPassportData, PassportStatus, VerificationStatus, SkillLevel } from '../types/platform';

import { FadeInUp } from '../components/motion/FadeInUp';

interface PassportViewProps {
  onNavigate: (view: ViewType) => void;
}

export const PassportView: React.FC<PassportViewProps> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const [isExporting, setIsExporting] = useState(false);

  // If no user/profile is loaded, show an informative state
  if (!profile) {
    return (
      <div className="flex-1 w-full min-h-screen bg-[#F7F8F3] py-16 px-4 flex flex-col items-center justify-center text-center">
        <div className="max-w-md w-full bg-white border border-[#E2E8E5] p-8 rounded-3xl shadow-sm space-y-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#06234B]/5 flex items-center justify-center text-[#06234B]">
            <FaIcon icon={faShareNodes} className="text-xl" />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading text-xl font-bold text-[#06234B]">Skill Passport Numérique</h2>
            <p className="text-xs text-[#5C6B78] leading-relaxed">
              Connectez-vous pour consulter ou exporter votre passeport officiel attestant de vos compétences vérifiées et projets accomplis.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('auth')}
              className="sb-btn flex-1 py-3 px-4 rounded-xl bg-[#06234B] text-white text-xs font-bold hover:bg-[#1A2233] transition-colors cursor-pointer"
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="sb-btn flex-1 py-3 px-4 rounded-xl border border-[#E2E8E5] text-[#06234B] text-xs font-bold hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Map Profile to SkillPassportData
  const mapSkillLevel = (stage: string, level: number): SkillLevel => {
    // Stage logic or numeric logic
    if (stage === 'verified' || level >= 80) return 'EXPERT';
    if (stage === 'demonstrated' || level >= 60) return 'AVANCÉ';
    if (stage === 'practicing' || level >= 40) return 'INTERMÉDIAIRE';
    return 'DÉBUTANT';
  };

  const mapVerificationStatus = (stage: string): VerificationStatus => {
    if (stage === 'verified') return 'VÉRIFIÉ';
    if (stage === 'demonstrated') return 'EN COURS DE VÉRIFICATION';
    return 'NON VÉRIFIÉ';
  };

  const passportData: SkillPassportData = {
    passportId: profile.passport_id || `SB-XX-XX-XXXXXX`,
    userId: profile.id,
    status: 'ACTIVE' as PassportStatus,
    issuedAt: profile.created_at || new Date().toISOString(),
    publicVisibility: profile.profile_visibility === 'public',
    skills: (profile.skills || []).map(s => ({
      name: s.name,
      level: mapSkillLevel(s.stage, s.level),
      status: mapVerificationStatus(s.stage)
    })),
    metrics: {
      projects: profile.projects?.length || 0,
      challenges: 0, // Currently no challenges data
      evaluations: 0,
      validations: profile.validations?.length || 0,
      certifications: profile.certifications?.length || 0
    }
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    // Simulate generation time then print
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 500);
  };

  return (
    <div className="flex-1 w-full min-h-screen bg-[#F5F7F6] pb-24 lg:pb-8">
      
      {/* Utility / Actions Header */}
      <div className="bg-white border-b border-[#E2E8E5] sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('dashboard-talent')}
              className="sb-btn p-2 rounded-xl border border-[#E2E8E5] text-stone-500 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <FaIcon icon={faArrowLeft} />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-heading font-black text-[#101820]">Skill Passport</h1>
              <p className="text-xs text-stone-500 font-medium hidden sm:block">
                Votre identité professionnelle vérifiée.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => onNavigate('dashboard-talent')} // Placeholder for edit profile
              className="sb-btn flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#E2E8E5] text-stone-700 hover:bg-stone-50 text-xs font-bold transition-colors inline-flex justify-center items-center gap-2 cursor-pointer"
            >
              <FaIcon icon={faEdit} /> Mettre à jour
            </button>
            <button 
              className="sb-btn p-2.5 rounded-xl border border-[#E2E8E5] text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
              title="Partager"
            >
              <FaIcon icon={faShareNodes} />
            </button>
            <button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="sb-btn flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#123B5D] hover:bg-[#0A2338] text-white text-xs font-bold transition-colors inline-flex justify-center items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <FaIcon icon={faDownload} /> {isExporting ? 'Génération...' : 'Télécharger PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Passport Display Area */}
      <FadeInUp delay={0.1} duration={0.6} yOffset={16} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex justify-center items-center print:p-0 print:m-0">
        <SkillPassport user={profile} passport={passportData} />
      </FadeInUp>
      
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { ViewType } from '../../../types/platform';
import { useAuth } from '../../../context/AuthContext';
import { UserSkillItem, UserProjectItem, Opportunity } from '../../../types';
import { SkillService } from '../../../services/skillService';
import { ProjectService } from '../../../services/projectService';
import { OpportunityService } from '../../../services/opportunityService';

import { DashboardHeader } from '../DashboardHeader';
import { DashboardCard } from '../DashboardCard';
import { EmptyState } from '../EmptyState';
import { UserAvatar } from '../../UserAvatar';
import { ProfileModal } from '../../ProfileModal';
import { FaIcon } from '../../FaIcon';
import {
  faShieldHalved,
  faFolderOpen,
  faPlus,
  faArrowRight,
  faCheck,
  faBullseye,
  faExternalLinkAlt,
  faLayerGroup,
  faTimes,
  faCheckCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';

interface TalentDashboardProps {
  onNavigate: (view: ViewType) => void;
  onRoleSwitch?: (role: 'talent' | 'mentor' | 'company') => void;
}

interface OpportunityMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  matchScore: number;
  matchedSkills: string[];
  skillsToImprove: string[];
  salary?: string;
  workplaceType: string;
  description: string;
}

export const TalentDashboard: React.FC<TalentDashboardProps> = ({
  onNavigate,
  onRoleSwitch,
}) => {
  const { user, profile, refreshProfile } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Data states
  const [userSkills, setUserSkills] = useState<UserSkillItem[]>([]);
  const [userProjects, setUserProjects] = useState<UserProjectItem[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  // Skill Add Modal state
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend');
  const [newSkillLevel, setNewSkillLevel] = useState(75);
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  // Selected Opportunity Detail Modal
  const [selectedOpp, setSelectedOpp] = useState<OpportunityMatch | null>(null);
  const [applyMessage, setApplyMessage] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Filter for opportunities
  const [oppTypeFilter, setOppTypeFilter] = useState<string>('all');

  // Load user data
  useEffect(() => {
    let isMounted = true;

    async function loadTalentData() {
      // 1. Load user skills from profile or service
      let skills: UserSkillItem[] = [];
      if (profile?.skills && profile.skills.length > 0) {
        skills = profile.skills;
      } else if (user?.id) {
        const res = await SkillService.getUserSkills(user.id);
        if (res.data && res.data.length > 0) {
          skills = res.data.map((s) => ({
            id: s.id,
            name: s.name,
            category: s.category,
            stage: s.stage,
            level: s.level,
            proofs: (s.proofs || []).map((p) => ({
              id: p.id,
              title: p.title,
              url: p.url,
              type: p.type as any,
              date: p.date,
              verified: p.verified,
            })),
          }));
        }
      }

      // Default skills demonstration if fresh demo account
      if (skills.length === 0) {
        skills = [
          { id: 'sk-1', name: 'React', category: 'Frontend', stage: 'verified', level: 88, proofs: [] },
          { id: 'sk-2', name: 'JavaScript', category: 'Frontend', stage: 'verified', level: 90, proofs: [] },
          { id: 'sk-3', name: 'UI/UX Design', category: 'Design', stage: 'demonstrated', level: 75, proofs: [] },
          { id: 'sk-4', name: 'TypeScript', category: 'Frontend', stage: 'learning', level: 60, proofs: [] },
        ];
      }

      // 2. Load user projects
      let projects: UserProjectItem[] = [];
      if (profile?.projects && profile.projects.length > 0) {
        projects = profile.projects;
      } else if (user?.id) {
        const pRes = await ProjectService.getUserProjects(user.id);
        if (pRes.data && pRes.data.length > 0) {
          projects = pRes.data.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            tech: p.technologies || p.skills_used || [],
            githubUrl: p.github_url || undefined,
            liveUrl: p.live_url || undefined,
            verified: p.verified || false,
            createdAt: p.created_at,
          }));
        }
      }

      // Default project demonstration if fresh
      if (projects.length === 0) {
        projects = [
          {
            id: 'proj-1',
            title: 'AfroPay — Interface Mobile & Micro-services',
            description: 'Application de transferts instantanés développée en React et TypeScript avec intégration des API de paiement locales.',
            tech: ['React', 'JavaScript', 'Tailwind CSS', 'UI/UX'],
            githubUrl: 'https://github.com/example/afropay',
            liveUrl: 'https://afropay-demo.com',
            verified: true,
            createdAt: '2026-02-15T10:00:00Z',
          },
        ];
      }

      // 3. Load published opportunities
      const oppRes = await OpportunityService.getPublishedOpportunities();
      const oppList = oppRes.data || [];

      if (isMounted) {
        setUserSkills(skills);
        setUserProjects(projects);
        setOpportunities(oppList);
      }
    }

    loadTalentData();

    return () => {
      isMounted = false;
    };
  }, [user?.id, profile]);

  // Handle adding new skill
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setIsAddingSkill(true);

    const newSkill: UserSkillItem = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      stage: newSkillLevel >= 80 ? 'demonstrated' : 'learning',
      level: newSkillLevel,
      proofs: [],
    };

    if (user && profile) {
      await SkillService.addUserSkill(user.id, profile.id, {
        name: newSkill.name,
        category: newSkill.category,
        level: newSkill.level,
        stage: newSkill.stage,
      });
      await refreshProfile();
    }

    setUserSkills((prev) => [newSkill, ...prev]);
    setNewSkillName('');
    setIsAddingSkill(false);
    setIsAddSkillOpen(false);
  };

  // Handle Apply to Matched Opportunity
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpp) return;

    setIsApplying(true);
    if (user && profile) {
      await OpportunityService.applyToOpportunity(user.id, profile.id, {
        opportunity_id: selectedOpp.id,
        cover_message: applyMessage,
        passport_sbid: profile.passport_id || undefined,
      });
    }

    setIsApplying(false);
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setSelectedOpp(null);
      setApplyMessage('');
    }, 2000);
  };

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    let score = 20; // Base signup
    if (profile?.first_name && profile?.last_name) score += 15;
    if (profile?.headline || profile?.title) score += 15;
    if (profile?.bio) score += 10;
    if (profile?.location) score += 10;
    if (userSkills.length > 0) score += 15;
    if (userProjects.length > 0) score += 15;
    return Math.min(100, score);
  };

  const completionPct = calculateCompletion();
  const sbid = profile?.passport_id || (profile?.id ? `SB-${profile.id.slice(0, 8).toUpperCase()}` : 'SB-24-08-7F3A9C');

  // Defined matching opportunities with explicit score explanations
  const matchingOpportunities: OpportunityMatch[] = [
    {
      id: 'opp-match-1',
      title: 'Développeur Frontend React / UI',
      company: 'TechAfrique Labs',
      location: 'Dakar, Sénégal (Hybride)',
      type: 'emploi',
      matchScore: 92,
      matchedSkills: ['React', 'JavaScript', 'UI/UX Design'],
      skillsToImprove: ['TypeScript'],
      salary: '850 000 - 1 200 000 XOF/mois',
      workplaceType: 'Hybride',
      description:
        'Nous recherchons un développeur Frontend passionné pour concevoir les interfaces de nos solutions SaaS bancaires panafricaines. Expérience requise sur React et souci du détail ergonomique.',
    },
    {
      id: 'opp-match-2',
      title: 'Ingénieur Mobile & Offline-First',
      company: 'Sahel Scale Ventures',
      location: 'Abidjan, Côte d’Ivoire (Télétravail)',
      type: 'emploi',
      matchScore: 85,
      matchedSkills: ['React', 'JavaScript'],
      skillsToImprove: ['React Native', 'SQLite'],
      salary: '1 000 000 - 1 500 000 XOF/mois',
      workplaceType: 'Télétravail',
      description:
        'Rejoignez notre équipe d’ingénierie pour bâtir des applications mobiles résilientes aux réseaux à faible connectivité en Afrique de l’Ouest.',
    },
    {
      id: 'opp-match-3',
      title: 'Mission Intégration Design System & Accessibilité',
      company: 'Digital Bridge West Africa',
      location: 'Cotonou, Bénin (Mission)',
      type: 'mission',
      matchScore: 78,
      matchedSkills: ['UI/UX Design', 'JavaScript'],
      skillsToImprove: ['Tailwind CSS v4', 'Figma Tokens'],
      salary: '500 000 XOF forfaitaire',
      workplaceType: 'Télétravail',
      description:
        'Mission de 6 semaines pour auditer et moderniser l’ensemble des composants web d’un portail gouvernemental décentralisé.',
    },
  ];

  // Helper for skill level badge
  const getLevelLabel = (level: number, stage?: string) => {
    if (stage === 'verified' || level >= 85) return { label: 'Avancé / Vérifié', color: 'bg-[#EEF6E0] text-[#3D6B10] border-[#D6ECC0]' };
    if (level >= 70) return { label: 'Intermédiaire', color: 'bg-[#E6EEF8] text-[#06234B] border-[#CADBF0]' };
    return { label: 'En apprentissage', color: 'bg-[#FEFCE8] text-[#854D0E] border-[#FEF08A]' };
  };

  return (
    <div className="flex-1 w-full min-h-screen bg-[#F7F8F3] pb-24 lg:pb-12 text-[#1A2233]">
      {/* SECTION 5: HEADER */}
      <DashboardHeader
        greeting={`Bonjour, ${profile?.first_name || 'Talent'}`}
        subtitle="Construisez votre profil de compétences et découvrez les opportunités qui vous correspondent."
        profile={profile}
        roleLabel="Talent Vérifié"
        roleType="talent"
        completionPercentage={completionPct}
        primaryAction={{
          label: 'Compléter mon profil',
          onClick: () => setIsProfileModalOpen(true),
        }}
        secondaryAction={{
          label: 'Voir mon Skill Passport',
          onClick: () => onNavigate('passport'),
        }}
        onRoleSwitch={onRoleSwitch}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* SECTION 6: BLOC PROFIL / SKILL PASSPORT SOUVERAIN */}
        <div className="bg-gradient-to-br from-[#06234B] to-[#0B3168] rounded-3xl p-6 sm:p-8 text-white shadow-[0_12px_32px_rgba(6,35,75,0.18)] relative overflow-hidden border border-[#0B3168]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#68A91B]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <UserAvatar
                profile={profile}
                size="xl"
                className="ring-4 ring-white/10 shadow-lg shrink-0"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                    {profile?.first_name || 'Talent'} {profile?.last_name || ''}
                  </h2>
                  <span className="bg-[#68A91B] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <FaIcon icon={faShieldHalved} className="text-[10px]" />
                    Skill Passport Actif
                  </span>
                </div>

                <p className="text-sm text-[#C9D6E8] max-w-lg leading-relaxed">
                  {profile?.headline || profile?.bio || 'Développeur & Concepteur de solutions numériques panafricaines.'}
                </p>

                <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-[#9FB0C8]">
                  <span className="font-mono bg-white/10 px-2.5 py-1 rounded text-white font-medium border border-white/10">
                    ID : {sbid}
                  </span>
                  <span>{userSkills.length} compétences déclarées</span>
                  <span>•</span>
                  <span>{userProjects.length} projets & preuves</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => onNavigate('passport')}
                className="flex-1 lg:flex-initial px-5 py-3 rounded-xl bg-[#68A91B] hover:bg-[#4F8214] text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaIcon icon={faShieldHalved} />
                <span>Voir mon Skill Passport</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('public-passport')}
                className="flex-1 lg:flex-initial px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm transition-all border border-white/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Aperçu public</span>
                <FaIcon icon={faExternalLinkAlt} className="text-xs text-[#C9D6E8]" />
              </button>
            </div>
          </div>

          {/* Quick Passport Progress strip */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-xs text-[#9FB0C8]">Compétences</p>
              <p className="text-xl font-bold font-serif text-white">{userSkills.length}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-xs text-[#9FB0C8]">Preuves vérifiées</p>
              <p className="text-xl font-bold font-serif text-[#68A91B]">
                {userProjects.filter((p) => p.verified).length || userProjects.length}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-xs text-[#9FB0C8]">Score de crédibilité</p>
              <p className="text-xl font-bold font-serif text-white">88 / 100</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-xs text-[#9FB0C8]">Matchings actifs</p>
              <p className="text-xl font-bold font-serif text-[#68A91B]">3 offres</p>
            </div>
          </div>
        </div>

        {/* SECTION 9: MATCHING (PRIORITAIRE DANS LE DASHBOARD TALENT) */}
        <div id="talent-matches-section">
          <DashboardCard
            title="Opportunités pour vous"
            subtitle="Calculé automatiquement à partir de vos compétences validées et de vos preuves techniques."
            action={
              <button
                type="button"
                onClick={() => onNavigate('opportunities')}
                className="text-xs font-bold text-[#06234B] hover:text-[#68A91B] flex items-center gap-1.5 cursor-pointer"
              >
                <span>Explorer toutes les offres</span>
                <FaIcon icon={faArrowRight} className="text-[10px]" />
              </button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {matchingOpportunities.map((match) => (
                <div
                  key={match.id}
                  className="bg-[#FAFCFB] rounded-2xl border border-[#E2E8E5] p-5 flex flex-col justify-between hover:border-[#68A91B]/60 transition-all hover:shadow-[0_4px_16px_rgba(6,35,75,0.06)]"
                >
                  <div className="space-y-3">
                    {/* Match Score Badge */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#EEF6E0] text-[#4F8214] border border-[#D7E8BC]">
                        <FaIcon icon={faBullseye} className="text-xs" />
                        {match.matchScore}% de correspondance
                      </span>
                      <span className="text-[11px] font-semibold text-[#5C6B78] uppercase">
                        {match.type}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-base font-bold text-[#06234B] line-clamp-1">
                        {match.title}
                      </h3>
                      <p className="text-xs text-[#5C6B78] font-medium mt-0.5">
                        {match.company} • {match.location}
                      </p>
                    </div>

                    {/* Explanatory Skills Breakdown - NEVER SCORE ALONE */}
                    <div className="space-y-2 pt-2 border-t border-[#E2E8E5]/70 text-xs">
                      <div>
                        <p className="text-[11px] font-bold text-[#4F8214] uppercase tracking-wide flex items-center gap-1">
                          <FaIcon icon={faCheckCircle} className="text-[10px]" />
                          Compétences correspondantes :
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {match.matchedSkills.map((sk) => (
                            <span
                              key={sk}
                              className="px-2 py-0.5 rounded bg-white border border-[#D7E8BC] text-[#3D6B10] font-medium text-[11px]"
                            >
                              ✓ {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] font-bold text-[#5C6B78] uppercase tracking-wide flex items-center gap-1">
                          <FaIcon icon={faExclamationCircle} className="text-[10px] text-amber-500" />
                          À renforcer :
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {match.skillsToImprove.map((sk) => (
                            <span
                              key={sk}
                              className="px-2 py-0.5 rounded bg-[#FEFCE8] border border-[#FEF08A] text-[#854D0E] font-medium text-[11px]"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#E2E8E5]/60 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#06234B]">
                      {match.salary?.split('/')[0] || match.workplaceType}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedOpp(match)}
                      className="px-3.5 py-2 rounded-xl bg-[#06234B] hover:bg-[#0B3168] text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>Voir le détail</span>
                      <FaIcon icon={faArrowRight} className="text-[9px]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* SECTION 7 & 8: 2-COLUMN GRID (COMPÉTENCES + PROJETS & PREUVES) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SECTION 7: COMPÉTENCES */}
          <div id="talent-skills-section">
            <DashboardCard
              title={`Mes Compétences (${userSkills.length})`}
              subtitle="Vos compétences évaluées avec leurs niveaux et preuves associées."
              action={
                <button
                  type="button"
                  onClick={() => setIsAddSkillOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#06234B] hover:bg-[#0B3168] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FaIcon icon={faPlus} className="text-[10px]" />
                  <span>Ajouter</span>
                </button>
              }
            >
              {userSkills.length === 0 ? (
                <EmptyState
                  icon={faLayerGroup}
                  title="Commencez par ajouter vos premières compétences"
                  description="Déclarez vos technologies et savoir-faire clés pour alimenter votre Skill Passport et débloquer le matching d'opportunités."
                  actionLabel="Ajouter une compétence"
                  onAction={() => setIsAddSkillOpen(true)}
                />
              ) : (
                <div className="space-y-3">
                  {userSkills.map((skill) => {
                    const badge = getLevelLabel(skill.level, skill.stage);
                    return (
                      <div
                        key={skill.id}
                        className="bg-[#FAFCFB] rounded-xl border border-[#E2E8E5] p-3.5 flex items-center justify-between gap-3 hover:bg-white transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#06234B]">{skill.name}</span>
                            <span className="text-[11px] text-[#5C6B78]">({skill.category})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}
                            >
                              {badge.label}
                            </span>
                            {skill.proofs && skill.proofs.length > 0 && (
                              <span className="text-[11px] text-[#5C6B78]">
                                • {skill.proofs.length} preuve(s)
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="w-24 text-right">
                          <span className="text-xs font-mono font-bold text-[#06234B]">
                            {skill.level}%
                          </span>
                          <div className="w-full h-1.5 bg-[#E2E8E5] rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-[#68A91B] rounded-full"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setIsAddSkillOpen(true)}
                    className="w-full py-2.5 rounded-xl border border-dashed border-[#DFE5D2] hover:border-[#68A91B] hover:bg-[#F4F9EE] text-xs font-bold text-[#4F8214] flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-3"
                  >
                    <FaIcon icon={faPlus} className="text-[10px]" />
                    <span>Gérer & ajouter mes compétences</span>
                  </button>
                </div>
              )}
            </DashboardCard>
          </div>

          {/* SECTION 8: PROJETS / PREUVES */}
          <div id="talent-projects-section">
            <DashboardCard
              title={`Mes Projets & Preuves (${userProjects.length})`}
              subtitle="Vos réalisations vérifiables apportant une preuve tangible de vos compétences."
              action={
                <button
                  type="button"
                  onClick={() => onNavigate('project-publish')}
                  className="px-3 py-1.5 rounded-lg bg-[#68A91B] hover:bg-[#4F8214] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FaIcon icon={faPlus} className="text-[10px]" />
                  <span>Ajouter une preuve</span>
                </button>
              }
            >
              {userProjects.length === 0 ? (
                <EmptyState
                  icon={faFolderOpen}
                  title="Vos compétences gagnent en crédibilité avec des preuves"
                  description="Publiez un projet, un lien GitHub ou une application déployée pour faire certifier vos aptitudes par des pairs et recruteurs."
                  actionLabel="Ajouter ma première preuve"
                  onAction={() => onNavigate('project-publish')}
                />
              ) : (
                <div className="space-y-4">
                  {userProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="bg-[#FAFCFB] rounded-xl border border-[#E2E8E5] p-4 space-y-3 hover:bg-white transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif text-sm font-bold text-[#06234B]">
                              {proj.title}
                            </h4>
                            {proj.verified && (
                              <span className="bg-[#EEF6E0] text-[#3D6B10] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D7E8BC] flex items-center gap-1">
                                <FaIcon icon={faCheck} className="text-[9px]" />
                                Preuve Vérifiée
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#5C6B78] mt-1 line-clamp-2 leading-relaxed">
                            {proj.description}
                          </p>
                        </div>
                      </div>

                      {proj.tech && proj.tech.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.tech.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-md bg-white border border-[#E2E8E5] text-[11px] font-medium text-[#06234B]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-[#E2E8E5]/60 text-xs">
                        <div className="flex items-center gap-3">
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#06234B] hover:text-[#68A91B] font-semibold inline-flex items-center gap-1"
                            >
                              <span>Code GitHub</span>
                              <FaIcon icon={faExternalLinkAlt} className="text-[9px]" />
                            </a>
                          )}
                          {proj.liveUrl && (
                            <a
                              href={proj.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#68A91B] hover:text-[#4F8214] font-semibold inline-flex items-center gap-1"
                            >
                              <span>Démo Live</span>
                              <FaIcon icon={faExternalLinkAlt} className="text-[9px]" />
                            </a>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => onNavigate('project-publish')}
                          className="text-[#5C6B78] hover:text-[#06234B] font-medium text-xs cursor-pointer"
                        >
                          Modifier
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => onNavigate('project-publish')}
                      className="text-xs font-bold text-[#06234B] hover:text-[#68A91B] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Voir tous mes projets</span>
                      <FaIcon icon={faArrowRight} className="text-[10px]" />
                    </button>
                  </div>
                </div>
              )}
            </DashboardCard>
          </div>
        </div>

        {/* SECTION 10: OPPORTUNITÉS RÉCENTES AVEC FILTRES */}
        <DashboardCard
          title="Opportunités récentes sur SkillBridge"
          subtitle="Offres d'emploi, missions et stages postés par nos entreprises partenaires."
          action={
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#F7F8F3] rounded-xl p-1 border border-[#E2E8E5]">
                {['all', 'emploi', 'stage', 'mission'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setOppTypeFilter(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                      oppTypeFilter === t
                        ? 'bg-white text-[#06234B] shadow-xs'
                        : 'text-[#5C6B78] hover:text-[#06234B]'
                    }`}
                  >
                    {t === 'all' ? 'Tous' : t}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onNavigate('opportunities')}
                className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl bg-[#06234B] hover:bg-[#0B3168] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Voir tout
              </button>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {opportunities
              .filter((o) => oppTypeFilter === 'all' || o.type === oppTypeFilter)
              .slice(0, 6)
              .map((opp) => (
                <div
                  key={opp.id}
                  className="bg-white rounded-2xl border border-[#E2E8E5] p-5 flex flex-col justify-between hover:border-[#68A91B] transition-all hover:shadow-[0_4px_16px_rgba(6,35,75,0.05)]"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E6EEF8] text-[#06234B] uppercase tracking-wide">
                        {opp.type}
                      </span>
                      <span className="text-xs text-[#5C6B78] font-mono">
                        {opp.workplace_type || 'Hybride'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif text-base font-bold text-[#06234B] line-clamp-1">
                        {opp.title}
                      </h4>
                      <p className="text-xs text-[#5C6B78] mt-0.5">
                        {opp.company?.name || 'Entreprise Partenaire'} • {opp.location || 'Dakar'}
                      </p>
                    </div>

                    <p className="text-xs text-[#5C6B78] line-clamp-2 leading-relaxed">
                      {opp.description}
                    </p>

                    {opp.required_skills && opp.required_skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {opp.required_skills.slice(0, 3).map((sk) => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 rounded bg-[#F7F8F3] border border-[#E2E8E5] text-[10px] font-semibold text-[#06234B]"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2E8E5]/70 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#68A91B]">
                      {opp.salary_min
                        ? `${opp.salary_min.toLocaleString()} ${opp.currency}`
                        : 'Rémunération compétitive'}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedOpp({
                          id: opp.id,
                          title: opp.title,
                          company: opp.company?.name || 'Entreprise Partenaire',
                          location: opp.location || 'Dakar',
                          type: opp.type,
                          matchScore: 88,
                          matchedSkills: opp.required_skills || ['Compétences requises'],
                          skillsToImprove: [],
                          salary: opp.salary_min ? `${opp.salary_min} ${opp.currency}` : undefined,
                          workplaceType: opp.workplace_type || 'Hybride',
                          description: opp.description,
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-[#06234B] hover:bg-[#0B3168] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Postuler
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <div className="text-center mt-6 pt-4 border-t border-[#E2E8E5]/60">
            <button
              type="button"
              onClick={() => onNavigate('opportunities')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-[#DFE5D2] hover:bg-[#F7F8F3] text-[#06234B] text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>Voir toutes les opportunités du catalogue</span>
              <FaIcon icon={faArrowRight} />
            </button>
          </div>
        </DashboardCard>
      </div>

      {/* MODAL: AJOUT DE COMPÉTENCE */}
      {isAddSkillOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8E5] space-y-6">
            <div className="flex items-center justify-between border-b border-[#E2E8E5]/70 pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#06234B]">
                  Ajouter une compétence
                </h3>
                <p className="text-xs text-[#5C6B78]">
                  Cette compétence s'affichera directement sur votre Skill Passport.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSkillOpen(false)}
                className="p-1 rounded-lg text-[#5C6B78] hover:bg-[#F7F8F3] cursor-pointer"
              >
                <FaIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-[#06234B] mb-1.5">
                  Nom de la compétence
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : React, Python, UI/UX, Docker..."
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8E5] focus:outline-2 focus:outline-[#68A91B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#06234B] mb-1.5">
                  Catégorie
                </label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8E5] focus:outline-2 focus:outline-[#68A91B]"
                >
                  <option value="Frontend">Frontend & Web</option>
                  <option value="Backend">Backend & APIs</option>
                  <option value="Mobile">Mobile & Offline-First</option>
                  <option value="Data">Data & Machine Learning</option>
                  <option value="Design">UI/UX & Product Design</option>
                  <option value="DevOps">DevOps & Cloud</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-bold text-[#06234B]">Niveau estimé</label>
                  <span className="font-mono font-bold text-[#4F8214]">{newSkillLevel}%</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={100}
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                  className="w-full accent-[#68A91B]"
                />
                <div className="flex justify-between text-[11px] text-[#5C6B78] mt-1">
                  <span>En apprentissage (30%)</span>
                  <span>Intermédiaire (60%)</span>
                  <span>Avancé (85%+)</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8E5]/70">
                <button
                  type="button"
                  onClick={() => setIsAddSkillOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E8E5] text-[#5C6B78] font-bold hover:bg-[#F7F8F3] cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isAddingSkill}
                  className="px-5 py-2.5 rounded-xl bg-[#68A91B] hover:bg-[#4F8214] text-white font-bold transition-colors cursor-pointer"
                >
                  {isAddingSkill ? 'Ajout en cours...' : 'Enregistrer la compétence'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DÉTAIL D'OPPORTUNITÉ & CANDIDATURE VIA SKILL PASSPORT */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8E5] space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E2E8E5]/70 pb-4">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#EEF6E0] text-[#4F8214] border border-[#D7E8BC] mb-1">
                  <FaIcon icon={faBullseye} className="text-[10px]" />
                  {selectedOpp.matchScore}% de matching
                </span>
                <h3 className="font-serif text-xl font-bold text-[#06234B]">
                  {selectedOpp.title}
                </h3>
                <p className="text-xs text-[#5C6B78] mt-0.5">
                  {selectedOpp.company} • {selectedOpp.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOpp(null)}
                className="p-1 rounded-lg text-[#5C6B78] hover:bg-[#F7F8F3] cursor-pointer"
              >
                <FaIcon icon={faTimes} />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-[#F7F8F3] p-4 rounded-xl space-y-2 border border-[#E2E8E5]">
                <p className="font-bold text-[#06234B]">Pourquoi ce match ?</p>
                <p className="text-xs text-[#5C6B78]">
                  Vos compétences vérifiées sur React et JavaScript couvrent 90% des prérequis de cette offre.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedOpp.matchedSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded bg-white border border-[#D7E8BC] text-[#3D6B10] font-bold text-[11px]"
                    >
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-bold text-[#06234B] mb-1">Description de la mission :</p>
                <p className="text-xs text-[#5C6B78] leading-relaxed">
                  {selectedOpp.description}
                </p>
              </div>

              {applySuccess ? (
                <div className="p-4 rounded-xl bg-[#EEF6E0] border border-[#D7E8BC] text-center space-y-1">
                  <p className="font-bold text-[#3D6B10]">
                    ✓ Candidature envoyée avec succès !
                  </p>
                  <p className="text-xs text-[#4F8214]">
                    Votre Skill Passport souverain a été transmis au recruteur.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-3 pt-2">
                  <div>
                    <label className="block font-bold text-[#06234B] mb-1">
                      Message d'accompagnement (optionnel)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Présentez brièvement comment votre expérience répond à ce besoin..."
                      value={applyMessage}
                      onChange={(e) => setApplyMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8E5] focus:outline-2 focus:outline-[#68A91B]"
                    />
                  </div>

                  <div className="bg-[#EEF6E0] p-3 rounded-xl border border-[#D7E8BC] text-xs text-[#3D6B10] flex items-center gap-2">
                    <FaIcon icon={faShieldHalved} className="text-sm shrink-0" />
                    <span>
                      Votre <strong>Skill Passport ({sbid})</strong> sera joint automatiquement avec vos preuves de compétences vérifiées.
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setSelectedOpp(null)}
                      className="px-4 py-2.5 rounded-xl border border-[#E2E8E5] text-[#5C6B78] font-bold hover:bg-[#F7F8F3] cursor-pointer"
                    >
                      Fermer
                    </button>
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="px-5 py-2.5 rounded-xl bg-[#68A91B] hover:bg-[#4F8214] text-white font-bold transition-colors cursor-pointer"
                    >
                      {isApplying ? 'Transmission...' : 'Postuler avec mon Skill Passport'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => {
            setIsProfileModalOpen(false);
            refreshProfile();
          }}
        />
      )}
    </div>
  );
};

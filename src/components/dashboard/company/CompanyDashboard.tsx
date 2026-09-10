import React, { useState } from 'react';
import { ViewType } from '../../../types/platform';
import { useAuth } from '../../../context/AuthContext';
import { OpportunityService } from '../../../services/opportunityService';
import { WorkplaceType } from '../../../types';

import { DashboardHeader } from '../DashboardHeader';
import { DashboardCard } from '../DashboardCard';
import { EmptyState } from '../EmptyState';
import { StatCard } from '../StatCard';
import { ProfileModal } from '../../ProfileModal';
import { FaIcon } from '../../FaIcon';
import {
  faBriefcase,
  faPlus,
  faUsers,
  faShieldHalved,
  faCheckCircle,
  faExclamationCircle,
  faEnvelope,
  faCheck,
  faTimes,
  faBullseye,
  faArchive,
  faEye,
} from '@fortawesome/free-solid-svg-icons';

interface CompanyDashboardProps {
  onNavigate: (view: ViewType) => void;
  onRoleSwitch?: (role: 'talent' | 'mentor' | 'company') => void;
}

interface CompanyOpportunityItem {
  id: string;
  title: string;
  type: string;
  location: string;
  workplaceType: string;
  requiredSkills: string[];
  status: 'active' | 'closed';
  publishedDate: string;
  applicantsCount: number;
  salary?: string;
  description: string;
}

interface CandidateMatch {
  id: string;
  name: string;
  headline: string;
  location: string;
  sbid: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  verifiedProofsCount: number;
  passportScore: number;
  opportunityId: string;
  bio: string;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({
  onNavigate,
  onRoleSwitch,
}) => {
  const { user, profile, refreshProfile } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Managed opportunities
  const [myOpportunities, setMyOpportunities] = useState<CompanyOpportunityItem[]>([
    {
      id: 'comp-opp-1',
      title: 'Développeur Frontend React / UI',
      type: 'CDI (Emploi)',
      location: 'Dakar, Sénégal',
      workplaceType: 'Hybride',
      requiredSkills: ['React', 'JavaScript', 'TypeScript', 'UI/UX Design'],
      status: 'active',
      publishedDate: 'Il y a 5 jours',
      applicantsCount: 6,
      salary: '900 000 - 1 300 000 XOF/mois',
      description:
        'Conception de l’interface web de notre plateforme fintech. Collaboration avec l’équipe produit et les architectes backend.',
    },
    {
      id: 'comp-opp-2',
      title: 'Architecte Cloud & Infrastructure Distribuée',
      type: 'CDI (Emploi)',
      location: 'Abidjan / Télétravail',
      workplaceType: 'Télétravail',
      requiredSkills: ['Kubernetes', 'Go', 'Docker', 'PostgreSQL'],
      status: 'active',
      publishedDate: 'Il y a 2 semaines',
      applicantsCount: 4,
      salary: '1 500 000 - 2 200 000 XOF/mois',
      description:
        'Supervision de l’infrastructure multi-cloud pour assurer 99.99% de disponibilité de nos passerelles de paiement.',
    },
    {
      id: 'comp-opp-3',
      title: 'Stage Ingénieur Mobile & Offline-First',
      type: 'Stage Pré-embauche',
      location: 'Cotonou, Bénin',
      workplaceType: 'Sur site',
      requiredSkills: ['React Native', 'TypeScript', 'SQLite'],
      status: 'closed',
      publishedDate: 'Clôturé le 15 fév.',
      applicantsCount: 12,
      salary: '250 000 XOF/mois',
      description:
        'Développement d’une application de collecte de données pour le secteur agricole avec synchronisation hors-ligne.',
    },
  ]);

  // Selected opportunity for candidate matching
  const [selectedOppId, setSelectedOppId] = useState<string>('comp-opp-1');

  // Candidate Matches database
  const [candidates] = useState<CandidateMatch[]>([
    {
      id: 'cand-1',
      name: 'Aïcha Konaté',
      headline: 'Senior Distributed Systems Architect & Frontend React',
      location: 'Dakar, Sénégal',
      sbid: 'SB-24-08-7F3A9C',
      matchScore: 94,
      matchedSkills: ['React', 'JavaScript', 'TypeScript'],
      missingSkills: ['Next.js'],
      verifiedProofsCount: 4,
      passportScore: 94,
      opportunityId: 'comp-opp-1',
      bio: 'Ingénieure logicielle rigoureuse avec 6 ans d’expérience sur les architectures de paiement et interfaces React performantes.',
    },
    {
      id: 'cand-2',
      name: 'Koffi David',
      headline: 'Développeur Full Stack Web & Mobile',
      location: 'Cotonou, Bénin',
      sbid: 'SB-24-07-4B2E11',
      matchScore: 88,
      matchedSkills: ['React', 'JavaScript', 'UI/UX Design'],
      missingSkills: ['TypeScript avancé'],
      verifiedProofsCount: 3,
      passportScore: 89,
      opportunityId: 'comp-opp-1',
      bio: 'Passionné par l’ergonomie web et l’accessibilité, auteur de plusieurs bibliothèques de composants open source.',
    },
    {
      id: 'cand-3',
      name: 'Chinedu Eze',
      headline: 'Lead Cloud Infrastructure Architect',
      location: 'Lagos, Nigéria',
      sbid: 'SB-24-06-99A0D2',
      matchScore: 96,
      matchedSkills: ['Kubernetes', 'Go', 'Docker', 'PostgreSQL'],
      missingSkills: [],
      verifiedProofsCount: 6,
      passportScore: 96,
      opportunityId: 'comp-opp-2',
      bio: 'Expert en conteneurisation et automatisation Kubernetes à grande échelle à travers l’Afrique de l’Ouest.',
    },
    {
      id: 'cand-4',
      name: 'Mamadou Diallo',
      headline: 'Ingénieur DevOps Junior',
      location: 'Bamako, Mali',
      sbid: 'SB-24-09-8A1C4E',
      matchScore: 78,
      matchedSkills: ['Docker', 'PostgreSQL'],
      missingSkills: ['Kubernetes en production', 'Go'],
      verifiedProofsCount: 2,
      passportScore: 82,
      opportunityId: 'comp-opp-2',
      bio: 'Spécialiste Docker et CI/CD en recherche de défis sur des architectures micro-services de haute tenue.',
    },
  ]);

  // Publish Opportunity Modal State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('emploi');
  const [newLocation, setNewLocation] = useState('');
  const [newWorkplaceType, setNewWorkplaceType] = useState<WorkplaceType>('hybrid');
  const [newSkills, setNewSkills] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmittingOpp, setIsSubmittingOpp] = useState(false);

  // Inspected Candidate Skill Passport Modal State
  const [inspectedCandidate, setInspectedCandidate] = useState<CandidateMatch | null>(null);

  // Toggle opportunity status (close/reopen)
  const toggleOppStatus = (id: string) => {
    setMyOpportunities((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          return {
            ...o,
            status: o.status === 'active' ? 'closed' : 'active',
          };
        }
        return o;
      })
    );
  };

  // Publish New Opportunity Handler
  const handlePublishOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    setIsSubmittingOpp(true);

    const skillsArray = newSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Call service if user/profile available
    if (user && profile) {
      await OpportunityService.createOpportunity(user.id, profile.id, {
        title: newTitle.trim(),
        description: newDesc.trim(),
        type: newType as any,
        location: newLocation.trim() || 'Dakar / Télétravail',
        workplace_type: newWorkplaceType,
        required_skills: skillsArray.length > 0 ? skillsArray : ['Compétences clés'],
        currency: 'XOF',
      });
    }

    const createdOpp: CompanyOpportunityItem = {
      id: `opp-${Date.now()}`,
      title: newTitle.trim(),
      type: newType === 'emploi' ? 'CDI (Emploi)' : newType === 'stage' ? 'Stage' : 'Mission',
      location: newLocation.trim() || 'Dakar / Télétravail',
      workplaceType: newWorkplaceType === 'remote' ? '100% Télétravail' : newWorkplaceType === 'onsite' ? 'Sur site' : 'Hybride',
      requiredSkills: skillsArray.length > 0 ? skillsArray : ['Compétences clés'],
      status: 'active',
      publishedDate: 'À l’instant',
      applicantsCount: 0,
      salary: newSalary.trim() || undefined,
      description: newDesc.trim(),
    };

    setMyOpportunities((prev) => [createdOpp, ...prev]);
    setSelectedOppId(createdOpp.id);
    setIsSubmittingOpp(false);
    setIsPublishModalOpen(false);

    // Reset fields
    setNewTitle('');
    setNewDesc('');
    setNewSkills('');
    setNewSalary('');
    setNewLocation('');
  };

  // KPIs
  const activeOppsCount = myOpportunities.filter((o) => o.status === 'active').length;
  const closedOppsCount = myOpportunities.filter((o) => o.status === 'closed').length;
  const totalApplicants = myOpportunities.reduce((acc, cur) => acc + cur.applicantsCount, 0);

  // Filter candidates for selected opportunity
  const currentOppCandidates = candidates.filter((c) => c.opportunityId === selectedOppId);
  const currentOpp = myOpportunities.find((o) => o.id === selectedOppId);

  const companyName = profile?.first_name || (profile as any)?.company_name || 'FinTech Alliance West Africa';

  return (
    <div className="flex-1 w-full min-h-screen bg-[#F7F8F3] pb-24 lg:pb-12 text-[#1A2233]">
      {/* SECTION 16: HEADER ENTREPRISE */}
      <DashboardHeader
        greeting={`Bonjour, ${companyName}`}
        subtitle="Découvrez des talents correspondant à vos besoins et gérez vos opportunités."
        profile={profile}
        roleLabel="Entreprise Partenaire"
        roleType="company"
        primaryAction={{
          label: 'Publier une opportunité',
          onClick: () => setIsPublishModalOpen(true),
        }}
        secondaryAction={{
          label: 'Voir mes opportunités',
          onClick: () => {
            const el = document.getElementById('company-opportunities-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          },
        }}
        onRoleSwitch={onRoleSwitch}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* SECTION 17: STATISTIQUES ENTREPRISE UTILES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Opportunités actives"
            value={activeOppsCount}
            sublabel="Offres ouvertes aux candidatures"
            icon={faBriefcase}
            variant="highlight"
          />
          <StatCard
            label="Opportunités fermées"
            value={closedOppsCount}
            sublabel="Postes pourvus ou archivés"
            icon={faArchive}
          />
          <StatCard
            label="Candidats & Matchs"
            value={totalApplicants}
            sublabel="Profils pré-qualifiés reçus"
            icon={faUsers}
          />
          <StatCard
            label="Skill Passports audités"
            value="18"
            sublabel="Preuves de compétences vérifiées"
            icon={faShieldHalved}
            variant="navy"
          />
        </div>

        {/* SECTION 19 & 20: CANDIDATS & MATCHING ENTREPRISE (PRIORITÉ MAJEURE DU HACKATHON) */}
        <div id="company-matching-section">
          <DashboardCard
            title="Candidats & Matching par Opportunité"
            subtitle="Explorez les profils et auditez leurs compétences souveraines avec le Skill Passport."
            action={
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#5C6B78] font-medium hidden sm:inline">
                  Offre ciblée :
                </span>
                <select
                  value={selectedOppId}
                  onChange={(e) => setSelectedOppId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#E2E8E5] text-xs font-bold text-[#06234B] bg-[#F7F8F3] focus:outline-2 focus:outline-[#68A91B] cursor-pointer"
                >
                  {myOpportunities.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.title} ({o.status === 'active' ? 'Active' : 'Fermée'})
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {/* Header banner of selected opportunity */}
            {currentOpp && (
              <div className="bg-[#FAFCFB] rounded-2xl border border-[#E2E8E5] p-4.5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-base font-bold text-[#06234B]">
                      {currentOpp.title}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        currentOpp.status === 'active'
                          ? 'bg-[#EEF6E0] text-[#3D6B10] border-[#D7E8BC]'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {currentOpp.status === 'active' ? 'Active' : 'Fermée'}
                    </span>
                  </div>
                  <p className="text-xs text-[#5C6B78]">
                    {currentOpp.type} • {currentOpp.location} • {currentOpp.workplaceType}
                    {currentOpp.salary ? ` • ${currentOpp.salary}` : ''}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-xs font-bold text-[#06234B] mr-1">
                    Compétences attendues :
                  </span>
                  {currentOpp.requiredSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded bg-white border border-[#DFE5D2] text-[11px] font-semibold text-[#06234B]"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Candidates list for this opportunity */}
            {currentOppCandidates.length === 0 ? (
              <EmptyState
                icon={faUsers}
                title="Aucun candidat pour cette opportunité pour l'instant"
                description="Notre moteur de matching analyse en permanence les nouveaux Skill Passports créés par les talents pour vous suggérer les profils les plus qualifiés."
                actionLabel="Explorer l'annuaire des talents"
                onAction={() => onNavigate('talents')}
              />
            ) : (
              <div className="space-y-4">
                {currentOppCandidates.map((cand) => (
                  <div
                    key={cand.id}
                    className="bg-white rounded-2xl border border-[#E2E8E5] p-5 sm:p-6 transition-all hover:border-[#68A91B]/60 hover:shadow-[0_4px_20px_rgba(6,35,75,0.06)] space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-13 h-13 rounded-2xl bg-[#06234B] text-white flex items-center justify-center font-bold font-serif text-lg shrink-0 shadow-xs">
                          {cand.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-serif font-bold text-base sm:text-lg text-[#06234B]">
                              {cand.name}
                            </h4>
                            <span className="font-mono text-[11px] bg-[#F7F8F3] border border-[#E2E8E5] px-2 py-0.5 rounded text-[#06234B] font-semibold">
                              ID : {cand.sbid}
                            </span>
                            <span className="text-xs text-[#5C6B78]">
                              📍 {cand.location}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#5C6B78] font-medium">
                            {cand.headline}
                          </p>
                          <p className="text-xs text-[#5C6B78] line-clamp-2 leading-relaxed pt-1">
                            {cand.bio}
                          </p>
                        </div>
                      </div>

                      {/* Matching Score Badge */}
                      <div className="sm:text-right shrink-0">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-extrabold bg-[#EEF6E0] text-[#4F8214] border border-[#D7E8BC]">
                          <FaIcon icon={faBullseye} className="text-xs" />
                          {cand.matchScore}% de matching
                        </span>
                        <p className="text-[11px] text-[#5C6B78] mt-1 font-semibold">
                          Score Passport : {cand.passportScore}/100
                        </p>
                      </div>
                    </div>

                    {/* Explanatory Skills Breakdown - NEVER SCORE ALONE */}
                    <div className="bg-[#FAFCFB] rounded-xl p-4 border border-[#E2E8E5] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="font-bold text-[#4F8214] uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                          <FaIcon icon={faCheckCircle} className="text-[11px]" />
                          Compétences correspondantes vérifiées :
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {cand.matchedSkills.map((sk) => (
                            <span
                              key={sk}
                              className="px-2.5 py-1 rounded-md bg-white border border-[#D7E8BC] text-[#3D6B10] font-bold text-xs"
                            >
                              ✓ {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="font-bold text-[#5C6B78] uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                          <FaIcon
                            icon={faExclamationCircle}
                            className="text-[11px] text-amber-500"
                          />
                          Compétences à renforcer / complémentaires :
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {cand.missingSkills.length > 0 ? (
                            cand.missingSkills.map((sk) => (
                              <span
                                key={sk}
                                className="px-2.5 py-1 rounded-md bg-[#FEFCE8] border border-[#FEF08A] text-[#854D0E] font-medium text-xs"
                              >
                                {sk}
                              </span>
                            ))
                          ) : (
                            <span className="text-[#5C6B78] italic text-xs">
                              Tous les prérequis sont pleinement couverts.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Verification Actions Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E2E8E5]/70 text-xs">
                      <div className="flex items-center gap-2 text-[#4F8214] font-semibold">
                        <FaIcon icon={faShieldHalved} />
                        <span>
                          {cand.verifiedProofsCount} projets & preuves techniques vérifiés
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setInspectedCandidate(cand)}
                          className="px-3.5 py-2 rounded-xl bg-white border border-[#06234B]/30 hover:bg-[#F7F8F3] text-[#06234B] font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <FaIcon icon={faEye} className="text-[#68A91B]" />
                          <span>Auditer le Skill Passport</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onNavigate('messaging')}
                          className="px-4 py-2 rounded-xl bg-[#06234B] hover:bg-[#0B3168] text-white font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <FaIcon icon={faEnvelope} />
                          <span>Contacter le talent</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>
        </div>

        {/* SECTION 18: MES OPPORTUNITÉS */}
        <div id="company-opportunities-section">
          <DashboardCard
            title={`Mes opportunités en cours (${myOpportunities.length})`}
            subtitle="Gérez vos offres publiées et visualisez le volume de candidatures reçues."
            action={
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#68A91B] hover:bg-[#4F8214] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FaIcon icon={faPlus} className="text-[10px]" />
                <span>Publier une opportunité</span>
              </button>
            }
          >
            {myOpportunities.length === 0 ? (
              <EmptyState
                icon={faBriefcase}
                title="Vous n'avez aucune opportunité publiée"
                description="Publiez votre première offre pour recevoir des profils pré-qualifiés et tirer parti de la vérification des compétences de SkillBridge."
                actionLabel="Publier ma première offre"
                onAction={() => setIsPublishModalOpen(true)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {myOpportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="bg-[#FAFCFB] rounded-2xl border border-[#E2E8E5] p-5 flex flex-col justify-between hover:border-[#68A91B]/50 transition-all hover:shadow-[0_4px_16px_rgba(6,35,75,0.05)]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            opp.status === 'active'
                              ? 'bg-[#EEF6E0] text-[#3D6B10] border-[#D7E8BC]'
                              : 'bg-gray-100 text-gray-600 border-gray-200'
                          }`}
                        >
                          {opp.status === 'active' ? 'Active' : 'Clôturée'}
                        </span>
                        <span className="text-xs text-[#5C6B78]">{opp.publishedDate}</span>
                      </div>

                      <div>
                        <h4 className="font-serif font-bold text-base text-[#06234B] line-clamp-1">
                          {opp.title}
                        </h4>
                        <p className="text-xs text-[#5C6B78] mt-0.5">
                          {opp.type} • {opp.location} ({opp.workplaceType})
                        </p>
                      </div>

                      <p className="text-xs text-[#5C6B78] line-clamp-2 leading-relaxed">
                        {opp.description}
                      </p>

                      <div className="space-y-1.5 pt-1">
                        <p className="text-[11px] font-bold text-[#5C6B78] uppercase">
                          Compétences requises :
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {opp.requiredSkills.map((sk) => (
                            <span
                              key={sk}
                              className="px-2 py-0.5 rounded bg-white border border-[#E2E8E5] text-[10px] font-semibold text-[#06234B]"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#E2E8E5]/70 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#06234B] flex items-center gap-1">
                          <FaIcon icon={faUsers} className="text-[#68A91B]" />
                          {opp.applicantsCount} candidat(s)
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleOppStatus(opp.id)}
                          className="text-[11px] font-semibold text-[#5C6B78] hover:text-[#06234B] cursor-pointer"
                        >
                          {opp.status === 'active' ? 'Clôturer' : 'Réactiver'}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOppId(opp.id);
                          const el = document.getElementById('company-matching-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full py-2 rounded-xl bg-[#06234B] hover:bg-[#0B3168] text-white text-xs font-bold transition-colors cursor-pointer text-center"
                      >
                        Voir les candidats correspondants
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>
        </div>

        {/* SECTION 21: PROFIL ENTREPRISE */}
        <DashboardCard
          title="Profil Organisation & Recrutement"
          subtitle="Informations visibles par les talents postulant à vos offres."
          action={
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg border border-[#E2E8E5] hover:bg-[#F7F8F3] text-xs font-bold text-[#06234B] transition-colors cursor-pointer"
            >
              Modifier le profil
            </button>
          }
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#06234B] text-white flex items-center justify-center font-serif font-bold text-2xl shrink-0 shadow-sm border border-[#0B3168]">
                {companyName.slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-lg text-[#06234B]">
                    {companyName}
                  </h4>
                  <span className="bg-[#EEF6E0] text-[#3D6B10] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D7E8BC] flex items-center gap-1">
                    <FaIcon icon={faCheck} className="text-[9px]" />
                    Compte Vérifié
                  </span>
                </div>
                <p className="text-xs text-[#5C6B78]">
                  Secteur : Fintech & Paiements Panafricains • Taille : 50-250 employés
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#5C6B78] pt-1">
                  <span>📍 Dakar, Sénégal (Siège)</span>
                  <span>•</span>
                  <span>🌐 fintechalliance-africa.com</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FAFCFB] p-4 rounded-xl border border-[#E2E8E5] text-xs space-y-1.5 min-w-[240px]">
              <p className="font-bold text-[#06234B]">Engagement SkillBridge :</p>
              <p className="text-[#5C6B78]">
                Recrutement par les compétences vérifiées et reconnaissance des talents autodidactes.
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* MODAL: PUBLIER UNE OPPORTUNITÉ */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8E5] space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2E8E5]/70 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#06234B]">
                  Publier une nouvelle opportunité
                </h3>
                <p className="text-xs text-[#5C6B78]">
                  Cette offre sera immédiatement indexée par le moteur de matching de SkillBridge.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="p-1.5 rounded-lg text-[#5C6B78] hover:bg-[#F7F8F3] cursor-pointer"
              >
                <FaIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handlePublishOpportunity} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-[#06234B] mb-1.5">
                  Titre du poste ou de la mission *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Développeur Frontend React, Architecte Cloud..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8E5] focus:outline-2 focus:outline-[#68A91B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#06234B] mb-1.5">
                    Type d'opportunité *
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8E5] focus:outline-2 focus:outline-[#68A91B]"
                  >
                    <option value="emploi">Emploi / CDI</option>
                    <option value="stage">Stage / Alternance</option>
                    <option value="mission">Mission Freelance</option>
                    <option value="collaboration">Collaboration</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#06234B] mb-1.5">
                    Mode de travail *
                  </label>
                  <select
                    value={newWorkplaceType}
                    onChange={(e) => setNewWorkplaceType(e.target.value as WorkplaceType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8E5] focus:outline-2 focus:outline-[#68A91B]"
                  >
                    <option value="hybrid">Hybride</option>
                    <option value="remote">100% Télétravail</option>
                    <option value="onsite">Sur site</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#06234B] mb-1.5">
                    Localisation (Ville, Pays)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : Dakar, Sénégal"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8E5] focus:outline-2 focus:outline-[#68A91B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#06234B] mb-1.5">
                    Fourchette de rémunération
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : 800 000 - 1 200 000 XOF/mois"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8E5] focus:outline-2 focus:outline-[#68A91B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#06234B] mb-1.5">
                  Compétences clés requises (séparées par des virgules) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : React, TypeScript, Tailwind CSS, API REST"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8E5] focus:outline-2 focus:outline-[#68A91B]"
                />
                <p className="text-[11px] text-[#5C6B78] mt-1">
                  Ces mots-clés servent à calculer le score de matching avec les Skill Passports.
                </p>
              </div>

              <div>
                <label className="block font-bold text-[#06234B] mb-1.5">
                  Description de la mission *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Décrivez les responsabilités, l'environnement technique et ce que vous attendez du talent..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8E5] focus:outline-2 focus:outline-[#68A91B]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8E5]/70">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E8E5] text-[#5C6B78] font-bold hover:bg-[#F7F8F3] cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOpp}
                  className="px-5 py-2.5 rounded-xl bg-[#68A91B] hover:bg-[#4F8214] text-white font-bold transition-colors cursor-pointer"
                >
                  {isSubmittingOpp ? 'Publication...' : 'Publier immédiatement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AUDITER LE SKILL PASSPORT DU CANDIDAT */}
      {inspectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8E5] space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E2E8E5]/70 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#06234B] text-white flex items-center justify-center font-bold text-base font-serif">
                  {inspectedCandidate.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#06234B]">
                      {inspectedCandidate.name}
                    </h3>
                    <span className="bg-[#EEF6E0] text-[#3D6B10] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D7E8BC] flex items-center gap-1">
                      <FaIcon icon={faShieldHalved} className="text-[9px]" />
                      Skill Passport Vérifié
                    </span>
                  </div>
                  <p className="text-xs text-[#5C6B78]">
                    {inspectedCandidate.headline} • 📍 {inspectedCandidate.location}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectedCandidate(null)}
                className="p-1 rounded-lg text-[#5C6B78] hover:bg-[#F7F8F3] cursor-pointer"
              >
                <FaIcon icon={faTimes} />
              </button>
            </div>

            {/* Passport Sovereign Summary */}
            <div className="bg-[#06234B] rounded-2xl p-5 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded text-[#C9D6E8] border border-white/10">
                  ID Souverain : {inspectedCandidate.sbid}
                </span>
                <span className="text-xs font-bold text-[#68A91B]">
                  Statut : ACTIF & CERTIFIÉ
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center pt-2">
                <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                  <p className="text-[10px] text-[#9FB0C8]">Score Global</p>
                  <p className="text-xl font-bold font-serif text-[#68A91B]">
                    {inspectedCandidate.passportScore}%
                  </p>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                  <p className="text-[10px] text-[#9FB0C8]">Preuves Vérifiées</p>
                  <p className="text-xl font-bold font-serif text-white">
                    {inspectedCandidate.verifiedProofsCount}
                  </p>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                  <p className="text-[10px] text-[#9FB0C8]">Adéquation Offre</p>
                  <p className="text-xl font-bold font-serif text-white">
                    {inspectedCandidate.matchScore}%
                  </p>
                </div>
              </div>
            </div>

            {/* Skills & Proofs */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <h4 className="font-bold text-[#06234B] mb-2 uppercase text-xs tracking-wide">
                  Compétences certifiées pour cette opportunité
                </h4>
                <div className="space-y-2">
                  {inspectedCandidate.matchedSkills.map((sk) => (
                    <div
                      key={sk}
                      className="bg-[#FAFCFB] p-3 rounded-xl border border-[#E2E8E5] flex items-center justify-between"
                    >
                      <span className="font-bold text-[#06234B]">✓ {sk}</span>
                      <span className="text-xs text-[#3D6B10] font-semibold bg-[#EEF6E0] px-2 py-0.5 rounded border border-[#D7E8BC]">
                        Niveau Avancé • Preuve GitHub & Déploiement
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#F7F8F3] p-4 rounded-xl border border-[#E2E8E5] space-y-1">
                <p className="font-bold text-[#06234B] text-xs">Preuves techniques vérifiées :</p>
                <p className="text-xs text-[#5C6B78]">
                  • Code source audité sur dépôt GitHub public (architecture modulaire, tests unitaires).
                </p>
                <p className="text-xs text-[#5C6B78]">
                  • Déploiement fonctionnel testé en ligne avec temps de réponse &lt; 200ms.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8E5]/70">
                <button
                  type="button"
                  onClick={() => setInspectedCandidate(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E8E5] text-[#5C6B78] font-bold hover:bg-[#F7F8F3] cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInspectedCandidate(null);
                    onNavigate('messaging');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#06234B] hover:bg-[#0B3168] text-white font-bold transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <FaIcon icon={faEnvelope} />
                  <span>Inviter en entretien</span>
                </button>
              </div>
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

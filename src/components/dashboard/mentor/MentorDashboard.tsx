import React, { useState } from 'react';
import { ViewType } from '../../../types/platform';
import { useAuth } from '../../../context/AuthContext';

import { DashboardHeader } from '../DashboardHeader';
import { DashboardCard } from '../DashboardCard';
import { EmptyState } from '../EmptyState';
import { StatCard } from '../StatCard';
import { ProfileModal } from '../../ProfileModal';
import { FaIcon } from '../../FaIcon';
import {
  faChalkboardTeacher,
  faCalendarCheck,
  faClock,
  faCheck,
  faStar,
  faArrowRight,
  faEnvelope,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';

interface MentorDashboardProps {
  onNavigate: (view: ViewType) => void;
  onRoleSwitch?: (role: 'talent' | 'mentor' | 'company') => void;
}

interface MentorshipRequest {
  id: string;
  talentName: string;
  talentHeadline: string;
  talentAvatar?: string;
  talentSbid: string;
  domain: string;
  message: string;
  date: string;
  status: 'pending' | 'accepted' | 'declined';
  requestedTopic: string;
}

interface TalentToGuide {
  id: string;
  name: string;
  domain: string;
  headline: string;
  skills: string[];
  objective: string;
  passportScore: number;
  sbid: string;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({
  onNavigate,
  onRoleSwitch,
}) => {
  const { profile, refreshProfile } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Availability state
  const [availability, setAvailability] = useState(
    profile?.availability || '2 créneaux disponibles cette semaine (Jeudis & Samedis)'
  );
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [newAvailability, setNewAvailability] = useState(availability);

  // Mentorship requests with real state manipulation
  const [requests, setRequests] = useState<MentorshipRequest[]>([
    {
      id: 'req-1',
      talentName: 'Mamadou Diallo',
      talentHeadline: 'Développeur Frontend Junior en reconversion',
      talentSbid: 'SB-24-09-8A1C4E',
      domain: 'Architecture Logicielle & Clean Code',
      message:
        'Bonjour ! Je finalise mon premier projet de microservices et je cherche des retours d’expérience sur la gestion de transactions distribuées et les tests d’intégration.',
      date: 'Il y a 2 jours',
      status: 'pending',
      requestedTopic: 'Revue de code & Bonnes pratiques',
    },
    {
      id: 'req-2',
      talentName: 'Fatou Bamba',
      talentHeadline: 'Ingénieure DevOps débutante',
      talentSbid: 'SB-24-08-3D5F90',
      domain: 'Cloud Infrastructure & Kubernetes',
      message:
        'J’aimerais être guidée pour structurer mes pipelines CI/CD sur GitHub Actions et optimiser les coûts cloud d’une application Dockerisée.',
      date: 'Il y a 4 jours',
      status: 'pending',
      requestedTopic: 'Architecture Cloud résiliente',
    },
  ]);

  // Talents à découvrir (Section 15)
  const talentsToDiscover: TalentToGuide[] = [
    {
      id: 'tal-1',
      name: 'Aïcha Konaté',
      domain: 'Systèmes Distribués',
      headline: 'Architecte Backend Go / Rust',
      skills: ['Go', 'PostgreSQL', 'Docker'],
      objective: 'Préparer un rôle de Staff Engineer dans la fintech',
      passportScore: 94,
      sbid: 'SB-24-07-A901F4',
    },
    {
      id: 'tal-2',
      name: 'Kofi Mensah',
      domain: 'Mobile & Offline-First',
      headline: 'Développeur React Native',
      skills: ['React Native', 'TypeScript', 'SQLite'],
      objective: 'Perfectionner la synchronisation de données en zone rurale',
      passportScore: 91,
      sbid: 'SB-24-08-C12B78',
    },
    {
      id: 'tal-3',
      name: 'Ndeye Sokhna',
      domain: 'UI/UX & Design Systems',
      headline: 'Product Designer Panafricaine',
      skills: ['Figma', 'Design Tokens', 'Accessibilité'],
      objective: 'Standardiser un design system bancaire multi-pays',
      passportScore: 89,
      sbid: 'SB-24-09-E44D32',
    },
  ];

  const handleAcceptRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'accepted' } : r))
    );
  };

  const handleDeclineRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'declined' } : r))
    );
  };

  const handleSaveAvailability = () => {
    setAvailability(newAvailability);
    setIsEditingAvailability(false);
  };

  // Expertise tags derived from profile or defaults
  const expertiseList = profile?.domain
    ? [profile.domain, 'Architecture Logicielle', 'Mentorat de Carrière', 'Leadership Technique']
    : ['Architecture Logicielle', 'Distributed Systems', 'Mentorat Technique', 'Code Review'];

  const experienceYears = 12; // Realistic expert seniority
  const pendingRequestsCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="flex-1 w-full min-h-screen bg-[#F7F8F3] pb-24 lg:pb-12 text-[#1A2233]">
      {/* SECTION 12: HEADER MENTOR */}
      <DashboardHeader
        greeting={`Bonjour, ${profile?.first_name || 'Mentor'}`}
        subtitle="Partagez votre expertise et accompagnez les talents dans leur progression."
        profile={profile}
        roleLabel="Mentor & Formateur"
        roleType="mentor"
        completionPercentage={90}
        primaryAction={{
          label: 'Modifier mon profil expert',
          onClick: () => setIsProfileModalOpen(true),
        }}
        secondaryAction={{
          label: 'Voir les talents',
          onClick: () => onNavigate('talents'),
        }}
        onRoleSwitch={onRoleSwitch}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* STATISTIQUES & INDICATEURS MENTOR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Demandes en attente"
            value={pendingRequestsCount}
            sublabel={pendingRequestsCount > 0 ? 'Réponse attendue' : 'À jour'}
            icon={faClock}
            variant={pendingRequestsCount > 0 ? 'highlight' : 'default'}
          />
          <StatCard
            label="Sessions accompagnées"
            value="34"
            sublabel="Talents coachés sur la plateforme"
            icon={faCalendarCheck}
          />
          <StatCard
            label="Expérience attestée"
            value={`${experienceYears} ans`}
            sublabel="Validation sectorielle"
            icon={faChalkboardTeacher}
          />
          <StatCard
            label="Évaluation moyenne"
            value="4.9 / 5"
            sublabel="Recommandé par 100% des talents"
            icon={faStar}
            variant="navy"
          />
        </div>

        {/* SECTION 13: BLOC DEMANDES DE MENTORAT (PRIORITÉ MENTOR) */}
        <div id="mentor-requests-section">
          <DashboardCard
            title={`Demandes de mentorat (${requests.length})`}
            subtitle="Acceptez ou refusez les demandes d'accompagnement soumises par des talents qualifiés."
          >
            {requests.length === 0 ? (
              <EmptyState
                icon={faChalkboardTeacher}
                title="Vous n'avez pas encore reçu de demande de mentorat"
                description="Votre profil expert est référencé dans l'annuaire de SkillBridge. Les talents ayant des besoins alignés avec vos domaines pourront vous solliciter."
                actionLabel="Explorer les profils de talents"
                onAction={() => onNavigate('talents')}
              />
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-[#FAFCFB] rounded-2xl border border-[#E2E8E5] p-5 sm:p-6 transition-all hover:border-[#DFE5D2] space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-full bg-[#06234B] text-white flex items-center justify-center font-bold text-sm font-serif shrink-0">
                          {req.talentName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif font-bold text-base text-[#06234B]">
                              {req.talentName}
                            </h4>
                            <span className="font-mono text-[10px] bg-white border border-[#E2E8E5] px-2 py-0.5 rounded text-[#5C6B78]">
                              {req.talentSbid}
                            </span>
                          </div>
                          <p className="text-xs text-[#5C6B78]">{req.talentHeadline}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#5C6B78]">{req.date}</span>
                        {req.status === 'pending' && (
                          <span className="bg-[#FEFCE8] text-[#854D0E] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#FEF08A]">
                            En attente
                          </span>
                        )}
                        {req.status === 'accepted' && (
                          <span className="bg-[#EEF6E0] text-[#3D6B10] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#D7E8BC] flex items-center gap-1">
                            <FaIcon icon={faCheck} className="text-[10px]" />
                            Acceptée
                          </span>
                        )}
                        {req.status === 'declined' && (
                          <span className="bg-[#FEE2E2] text-[#991B1B] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#FECACA]">
                            Refusée
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-[#E2E8E5] text-xs space-y-2">
                      <div className="flex items-center gap-2 text-[#06234B] font-bold">
                        <span>Objectif de la session :</span>
                        <span className="text-[#68A91B]">{req.requestedTopic}</span>
                      </div>
                      <p className="text-[#5C6B78] leading-relaxed italic">
                        "{req.message}"
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => onNavigate('messaging')}
                        className="text-xs font-semibold text-[#06234B] hover:text-[#68A91B] inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <FaIcon icon={faEnvelope} />
                        <span>Échanger par messagerie</span>
                      </button>

                      {req.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDeclineRequest(req.id)}
                            className="px-3.5 py-1.5 rounded-xl border border-[#E2E8E5] text-xs font-bold text-[#5C6B78] hover:bg-[#FEE2E2] hover:text-[#991B1B] hover:border-[#FECACA] transition-colors cursor-pointer"
                          >
                            Refuser
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAcceptRequest(req.id)}
                            className="px-4 py-1.5 rounded-xl bg-[#68A91B] hover:bg-[#4F8214] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <FaIcon icon={faCheck} />
                            <span>Accepter la demande</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[#5C6B78] italic">
                          Demande traitée
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>
        </div>

        {/* SECTION 14: PROFIL EXPERT & DISPONIBILITÉ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DashboardCard
              title="Profil Expert & Domaines d'Intervention"
              subtitle="Ce que les talents voient lorsqu'ils consultent votre profil de mentorat."
              action={
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-[#E2E8E5] hover:bg-[#F7F8F3] text-xs font-bold text-[#06234B] transition-colors cursor-pointer"
                >
                  Modifier mon profil
                </button>
              }
            >
              <div className="space-y-5">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5C6B78] mb-2">
                    Domaines d'expertise clés
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {expertiseList.map((exp) => (
                      <span
                        key={exp}
                        className="px-3 py-1.5 rounded-xl bg-[#F4F9EE] border border-[#D6ECC0] text-[#3D6B10] text-xs font-bold"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5C6B78] mb-1.5">
                    Bio & Vision de la transmission
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5C6B78] leading-relaxed bg-[#FAFCFB] p-4 rounded-xl border border-[#E2E8E5]">
                    {profile?.bio ||
                      '12 ans d’expérience dans la conception et l’accélération de solutions logicielles résilientes. Engagé pour accompagner la montée en compétences rigoureuse des ingénieurs africains à travers des retours concrets et exigeants.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E2E8E5] flex flex-wrap items-center justify-between text-xs text-[#5C6B78]">
                  <span>Langues d'accompagnement : Français, Anglais</span>
                  <span className="font-semibold text-[#06234B]">
                    Statut du compte : Mentor Agréé SkillBridge
                  </span>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* DISPONIBILITÉ */}
          <div>
            <DashboardCard
              title="Disponibilité"
              subtitle="Gérez vos créneaux ouverts aux talents."
            >
              <div className="space-y-4">
                <div className="bg-[#FAFCFB] p-4 rounded-xl border border-[#E2E8E5] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#06234B]">Créneaux actuels</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#68A91B]"></span>
                  </div>
                  {isEditingAvailability ? (
                    <div className="space-y-2 pt-1">
                      <input
                        type="text"
                        value={newAvailability}
                        onChange={(e) => setNewAvailability(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#E2E8E5] text-xs"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingAvailability(false)}
                          className="px-2 py-1 text-xs text-[#5C6B78]"
                        >
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveAvailability}
                          className="px-3 py-1 rounded bg-[#06234B] text-white text-xs font-bold"
                        >
                          Sauvegarder
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#5C6B78]">{availability}</p>
                  )}
                </div>

                {!isEditingAvailability && (
                  <button
                    type="button"
                    onClick={() => setIsEditingAvailability(true)}
                    className="w-full py-2 rounded-xl border border-[#E2E8E5] hover:bg-[#F7F8F3] text-xs font-bold text-[#06234B] transition-colors cursor-pointer"
                  >
                    Ajuster mes créneaux
                  </button>
                )}

                <div className="p-3.5 rounded-xl bg-[#EEF6E0] border border-[#D7E8BC] text-[11px] text-[#3D6B10] leading-relaxed">
                  💡 Vos créneaux sont mis à jour en temps réel sur l'annuaire public des mentors.
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* SECTION 15: TALENTS À ACCOMPAGNER */}
        <DashboardCard
          title="Talents à découvrir"
          subtitle="Profils à fort potentiel cherchant un accompagnement technique ou méthodologique."
          action={
            <button
              type="button"
              onClick={() => onNavigate('talents')}
              className="text-xs font-bold text-[#06234B] hover:text-[#68A91B] flex items-center gap-1.5 cursor-pointer"
            >
              <span>Voir tout l'annuaire des talents</span>
              <FaIcon icon={faArrowRight} className="text-[10px]" />
            </button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {talentsToDiscover.map((talent) => (
              <div
                key={talent.id}
                className="bg-[#FAFCFB] rounded-2xl border border-[#E2E8E5] p-5 flex flex-col justify-between hover:border-[#68A91B]/50 transition-all hover:shadow-[0_4px_16px_rgba(6,35,75,0.04)]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-[#E2E8E5] text-[#5C6B78]">
                      {talent.sbid}
                    </span>
                    <span className="text-[11px] font-bold text-[#4F8214] bg-[#EEF6E0] px-2 py-0.5 rounded-full border border-[#D7E8BC]">
                      Passport : {talent.passportScore}%
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-base text-[#06234B]">
                      {talent.name}
                    </h4>
                    <p className="text-xs text-[#5C6B78] font-medium mt-0.5">
                      {talent.headline}
                    </p>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-[#E2E8E5] text-xs">
                    <p className="text-[11px] font-bold text-[#5C6B78] uppercase">Objectif :</p>
                    <p className="text-xs text-[#06234B] mt-0.5 leading-tight">
                      {talent.objective}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {talent.skills.map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded bg-white border border-[#E2E8E5] text-[10px] font-semibold text-[#06234B]"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E2E8E5]/70 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onNavigate('talents')}
                    className="text-xs font-bold text-[#06234B] hover:text-[#68A91B] cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Voir le profil</span>
                    <FaIcon icon={faExternalLinkAlt} className="text-[9px]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('messaging')}
                    className="px-3 py-1.5 rounded-lg bg-[#06234B] hover:bg-[#0B3168] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Proposer session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

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

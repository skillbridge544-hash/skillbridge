import { ViewType } from '../types/platform';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faHouse,
  faUser,
  faListCheck,
  faFolderOpen,
  faShieldHalved,
  faBriefcase,
  faBullseye,
  faChalkboardTeacher,
  faEnvelope,
  faUsers,
  faPlusCircle,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';

export interface NavItemConfig {
  key: string;
  label: string;
  view?: ViewType;
  icon: IconDefinition;
  action?: 'openProfile' | 'scrollToSkills' | 'scrollToMatches' | 'scrollToRequests' | 'openPublishModal';
  highlight?: boolean;
}

export const TALENT_NAVIGATION: NavItemConfig[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    view: 'dashboard-talent',
    icon: faHouse,
  },
  {
    key: 'profile',
    label: 'Profil',
    icon: faUser,
    action: 'openProfile',
  },
  {
    key: 'skills',
    label: 'Compétences',
    icon: faListCheck,
    action: 'scrollToSkills',
  },
  {
    key: 'projects',
    label: 'Projets',
    view: 'project-publish',
    icon: faFolderOpen,
  },
  {
    key: 'passport',
    label: 'Skill Passport',
    view: 'passport',
    icon: faShieldHalved,
    highlight: true,
  },
  {
    key: 'opportunities',
    label: 'Opportunités',
    view: 'opportunities',
    icon: faBriefcase,
  },
  {
    key: 'matches',
    label: 'Mes Matchs',
    icon: faBullseye,
    action: 'scrollToMatches',
  },
  {
    key: 'mentors',
    label: 'Mentorat',
    view: 'mentors',
    icon: faChalkboardTeacher,
  },
  {
    key: 'messaging',
    label: 'Messagerie',
    view: 'messaging',
    icon: faEnvelope,
  },
];

export const MENTOR_NAVIGATION: NavItemConfig[] = [
  {
    key: 'dashboard',
    label: 'Dashboard Mentor',
    view: 'dashboard-mentor',
    icon: faHouse,
  },
  {
    key: 'profile',
    label: 'Profil Expert',
    icon: faUser,
    action: 'openProfile',
  },
  {
    key: 'requests',
    label: 'Demandes de mentorat',
    icon: faListCheck,
    action: 'scrollToRequests',
    highlight: true,
  },
  {
    key: 'talents',
    label: 'Talents à accompagner',
    view: 'talents',
    icon: faUsers,
  },
  {
    key: 'messaging',
    label: 'Messagerie',
    view: 'messaging',
    icon: faEnvelope,
  },
];

export const COMPANY_NAVIGATION: NavItemConfig[] = [
  {
    key: 'dashboard',
    label: 'Dashboard Entreprise',
    view: 'dashboard-company',
    icon: faHouse,
  },
  {
    key: 'profile',
    label: 'Profil Entreprise',
    icon: faBuilding,
    action: 'openProfile',
  },
  {
    key: 'opportunities',
    label: 'Mes Opportunités',
    view: 'opportunities',
    icon: faBriefcase,
  },
  {
    key: 'publish',
    label: 'Publier une offre',
    icon: faPlusCircle,
    action: 'openPublishModal',
    highlight: true,
  },
  {
    key: 'candidates',
    label: 'Candidats & Matchs',
    icon: faBullseye,
    action: 'scrollToMatches',
  },
  {
    key: 'talents',
    label: 'Explorer les talents',
    view: 'talents',
    icon: faUsers,
  },
  {
    key: 'messaging',
    label: 'Messagerie',
    view: 'messaging',
    icon: faEnvelope,
  },
];

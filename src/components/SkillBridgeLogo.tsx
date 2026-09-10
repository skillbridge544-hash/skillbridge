import React from 'react';

// ============================================================================
// EMPLACEMENT DU FICHIER IMAGE DU LOGO OFFICIEL SKILLBRIDGE (SVG / PNG)
// Vous pouvez remplacer le chemin ou l'import ci-dessous par votre fichier officiel
// Exemples :
//   import officialLogo from '../assets/skillbridge-logo.svg';
//   const DEFAULT_LOGO_SRC = '/logo.svg';
// ============================================================================
import defaultLogoImg from '../assets/logo.png';

export interface SkillBridgeLogoProps {
  className?: string;
  isDark?: boolean;
  withTagline?: boolean;
  showText?: boolean;
  /** Taille du logo (défaut: 'md') */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Chemin optionnel pour surcharger l'image directement */
  logoSrc?: string;
}

const sizeConfig = {
  sm: {
    container: 'w-9 h-9 sm:w-10 sm:h-10 p-1',
    text: 'text-lg sm:text-xl',
    tagline: 'text-[10px]',
    gap: 'gap-2.5',
  },
  md: {
    container: 'w-12 h-12 sm:w-14 sm:h-14 p-1 sm:p-1.5',
    text: 'text-2xl sm:text-3xl',
    tagline: 'text-[11px]',
    gap: 'gap-3 sm:gap-3.5',
  },
  lg: {
    container: 'w-16 h-16 sm:w-20 sm:h-20 p-1.5 sm:p-2',
    text: 'text-3xl sm:text-4xl',
    tagline: 'text-xs',
    gap: 'gap-4',
  },
  xl: {
    container: 'w-24 h-24 sm:w-28 sm:h-28 p-2 sm:p-3',
    text: 'text-4xl sm:text-5xl',
    tagline: 'text-sm',
    gap: 'gap-5',
  },
};

export const SkillBridgeLogo: React.FC<SkillBridgeLogoProps> = ({
  className = '',
  isDark = false,
  withTagline = false,
  showText = true,
  size = 'md',
  logoSrc,
}) => {
  const config = sizeConfig[size] || sizeConfig.md;
  const imageSource = logoSrc || defaultLogoImg;

  return (
    <div className={`inline-flex items-center ${config.gap} select-none group ${className}`}>
      {/* ========================================================================= */}
      {/* CONTENEUR VISUEL DU LOGO OFFICIEL (AGRANDI ET OPTIMISÉ)                  */}
      {/* ========================================================================= */}
      <div
        className={`logo-image-container ${config.container} bg-white rounded-xl sm:rounded-2xl border border-[#E2E8E5] flex items-center justify-center shrink-0 overflow-hidden shadow-sm transition-transform group-hover:scale-105`}
      >
        <img
          src={imageSource}
          alt="SkillBridge logo"
          className="w-full h-full object-contain pointer-events-none"
          draggable={false}
        />
      </div>

      {/* ========================================================================= */}
      {/* TEXTE DU LOGO : "Skill" (Deep Navy #06234B) + "Bridge" (Green #68A91B)   */}
      {/* ========================================================================= */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className={`${config.text} font-sans font-extrabold tracking-tight flex items-baseline`}>
            {/* "Skill" : Deep Navy #06234B (ou blanc si contexte sombre) */}
            <span className={isDark ? 'text-white' : 'text-[#06234B]'}>
              Skill
            </span>
            {/* "Bridge" : Green #68A91B */}
            <span className="text-[#68A91B]">
              Bridge
            </span>
          </div>

          {withTagline && (
            <span
              className={`${config.tagline} tracking-wider font-semibold uppercase mt-0.5 ${
                isDark ? 'text-stone-300' : 'text-[#5C6B78]'
              }`}
            >
              Skills & Opportunities
            </span>
          )}
        </div>
      )}
    </div>
  );
};

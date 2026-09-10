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
    container: 'w-7 h-7 sm:w-8 sm:h-8 p-1',
    text: 'text-base sm:text-lg',
    tagline: 'text-[9px]',
    gap: 'gap-2',
  },
  md: {
    container: 'w-9 h-9 sm:w-10 sm:h-10 p-1.5 sm:p-2',
    text: 'text-lg sm:text-xl',
    tagline: 'text-[10px]',
    gap: 'gap-2.5 sm:gap-3',
  },
  lg: {
    container: 'w-12 h-12 p-2',
    text: 'text-2xl',
    tagline: 'text-xs',
    gap: 'gap-3.5',
  },
  xl: {
    container: 'w-16 h-16 p-2.5',
    text: 'text-3xl',
    tagline: 'text-xs',
    gap: 'gap-4',
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
      {/* CONTENEUR VISUEL DU LOGO OFFICIEL                                         */}
      {/* - Fond blanc pur                                                          */}
      {/* - Coins légèrement arrondis (border-radius)                               */}
      {/* - Dimensions adaptées sans débordement (overflow-hidden)                  */}
      {/* - object-fit: contain pour préserver le ratio du logo                     */}
      {/* ========================================================================= */}
      <div
        className={`logo-image-container ${config.container} bg-white rounded-lg sm:rounded-xl border border-[#E2E8E5]/90 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs transition-transform group-hover:scale-105`}
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

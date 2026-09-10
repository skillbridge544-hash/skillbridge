import React, { useState } from 'react';
import { ViewType } from '../types/platform';
import { HeroBridgeVisual } from '../components/HeroBridgeVisual';
import { PremiumGridBackground } from '../components/PremiumGridBackground';
import { FadeInUp } from '../components/motion/FadeInUp';
import { StaggerContainer } from '../components/motion/StaggerContainer';
import { ScaleOnHover } from '../components/motion/ScaleOnHover';
import { BridgeConnector } from '../components/motion/BridgeConnector';
import { motion } from 'motion/react';
import gapSkillsImg from '../assets/gap/gap-skills.jpg';
import gapTalentImg from '../assets/gap/gap-talent.jpg';
import gapTransmissionImg from '../assets/gap/gap-transmission.jpg';
import gapOpportunitiesImg from '../assets/gap/gap-opportunities.jpg';
import { 
  ArrowRight, 
  CheckCircle2, 
  Share2
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: ViewType) => void;
  onOpenAuth?: () => void;
  isAuthenticated?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, isAuthenticated }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSent(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 4000);
  };

  return (
    <div className="flex-1 w-full text-[#101820] overflow-x-hidden selection:bg-[#59B83E] selection:text-white relative">
      <PremiumGridBackground />
      
      {/* 07 — HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[#E2E8E5] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            
            {/* Eyebrow */}
            <FadeInUp delay={0.05} yOffset={16}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E2E8E5] text-[#123B5D] text-xs font-bold tracking-widest uppercase shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#59B83E] sb-pulse-dot" />
                <span>L'ÉCOSYSTÈME AFRICAIN DES COMPÉTENCES</span>
              </div>
            </FadeInUp>

            {/* Headline */}
            <FadeInUp delay={0.15} yOffset={20}>
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#101820] tracking-tight leading-[1.15]">
                Les compétences existent. <br className="hidden sm:inline" />
                Nous construisons les{' '}
                <span className="text-[#59B83E] underline decoration-[#C8F169] decoration-4 underline-offset-8">
                  ponts
                </span>{' '}
                qui leur permettent d'aller plus loin.
              </h1>
            </FadeInUp>

            {/* Description */}
            <FadeInUp delay={0.25} yOffset={20}>
              <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
                SkillBridge connecte les compétences, les talents, l'expérience et les opportunités pour construire un écosystème où chacun peut apprendre, progresser, démontrer son savoir-faire et aller plus loin.
              </p>
            </FadeInUp>

            {/* CTA Buttons */}
            <FadeInUp delay={0.35} yOffset={20}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate(isAuthenticated ? 'dashboard-talent' : 'onboarding')}
                  className="sb-btn w-full sm:w-auto px-8 py-4 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white font-bold text-sm sm:text-base tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer group"
                >
                  <span>{isAuthenticated ? 'Accéder à mon espace' : 'Rejoindre SkillBridge'}</span>
                  <ArrowRight className="w-4 h-4 text-[#C8F169] group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="sb-btn w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-stone-50 border border-[#E2E8E5] text-[#123B5D] font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-[#123B5D]"
                >
                  <span>Découvrir notre vision</span>
                </button>
              </div>
            </FadeInUp>

            {/* Architectural Abstract Visual */}
            <FadeInUp delay={0.45} yOffset={24}>
              <div className="pt-10 sb-float">
                <HeroBridgeVisual />
              </div>
            </FadeInUp>

          </div>
        </div>
      </section>

      {/* 08 — SECTION PROBLÈME : THE GAP (STORYTELLING ÉDITORIAL IMMERSIF) */}
      <section className="relative py-28 sm:py-36 bg-gradient-to-b from-white via-[#F7F9F8] to-white border-b border-[#E2E8E5] z-10 overflow-hidden">
        
        {/* Subtle background ambient mesh */}
        <div className="absolute inset-0 architectural-grid opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <FadeInUp className="text-center max-w-3xl mx-auto mb-24 sm:mb-32 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E2E8E5] text-[#59B83E] text-xs font-mono font-bold tracking-widest uppercase shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#59B83E] sb-pulse-dot" />
              <span>THE GAP · LA RÉALITÉ DU TERRAIN</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#101820] tracking-tight leading-tight">
              Le talent est partout. <br className="hidden sm:inline" />
              <span className="text-[#123B5D]">Les opportunités</span> ne le sont pas toujours.
            </h2>
            <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              L'écosystème regorge de potentiels remarquables, mais l'absence de passerelles vérifiables crée une distance silencieuse entre les capacités réelles et la reconnaissance méritée.
            </p>
          </FadeInUp>

          {/* Alternating Narrative Blocks with Flow Connectors */}
          <div className="space-y-24 sm:space-y-36 relative">

            {/* Continuous Vertical Guide Line for Desktop */}
            <div className="hidden lg:block absolute left-1/2 top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-[#59B83E]/30 to-transparent -translate-x-1/2 pointer-events-none" />

            {/* ========================================================
                BLOC 1 : SKILLS (Texte à gauche / Image à droite)
               ======================================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative">
              
              {/* Central Connection Dot */}
              <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-[#123B5D] items-center justify-center z-20 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#59B83E]" />
              </div>

              {/* Text Left */}
              <motion.div 
                initial={{ opacity: 0, x: -36 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="lg:col-span-6 space-y-5 lg:pr-6 order-2 lg:order-1"
              >
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#123B5D] uppercase tracking-wider">
                  <span className="px-2.5 py-1 rounded-md bg-[#123B5D]/10 text-[#123B5D]">01</span>
                  <span>SKILLS & VISIBILITÉ</span>
                </div>
                
                <h3 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#101820] leading-snug">
                  Des compétences réelles, <br />
                  <span className="text-[#59B83E]">souvent invisibles</span> au monde.
                </h3>

                <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
                  Des milliers de développeurs, concepteurs et ingénieurs se forment en continu et créent des solutions sophistiquées. Pourtant, faute d'outils souverains d'audit et de visibilité internationale, leur maîtrise reste invisible aux yeux des recruteurs et des partenaires stratégiques.
                </p>

                <div className="pt-2 flex items-center gap-3 text-xs font-mono text-stone-500">
                  <span className="w-2 h-2 rounded-full bg-[#59B83E]" />
                  <span>Besoin : Transformer les lignes de code en preuves incontestables</span>
                </div>
              </motion.div>

              {/* Image Right */}
              <motion.div 
                initial={{ opacity: 0, x: 36, scale: 0.98 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="lg:col-span-6 order-1 lg:order-2"
              >
                <div className="relative rounded-3xl overflow-hidden bg-white p-2 sm:p-3 border border-[#E2E8E5] shadow-xl hover:shadow-2xl transition-all duration-500 group">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
                    <img 
                      src={gapSkillsImg} 
                      alt="Session collaborative de développement de compétences SkillBridge"
                      className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101820]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Communauté active · Labs & Équipes d'ingénierie
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* ========================================================
                BLOC 2 : TALENT (Image à gauche / Texte à droite)
               ======================================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative">
              
              {/* Central Connection Dot */}
              <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-[#59B83E] items-center justify-center z-20 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#123B5D]" />
              </div>

              {/* Image Left */}
              <motion.div 
                initial={{ opacity: 0, x: -36, scale: 0.98 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="lg:col-span-6"
              >
                <div className="relative rounded-3xl overflow-hidden bg-white p-2 sm:p-3 border border-[#E2E8E5] shadow-xl hover:shadow-2xl transition-all duration-500 group">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
                    <img 
                      src={gapTalentImg} 
                      alt="Talent individuel concentré et engagé dans son parcours"
                      className="w-full h-full object-cover object-top rounded-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101820]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Identité certifiée · Révélation du potentiel souverain
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Text Right */}
              <motion.div 
                initial={{ opacity: 0, x: 36 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="lg:col-span-6 space-y-5 lg:pl-6"
              >
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#59B83E] uppercase tracking-wider">
                  <span className="px-2.5 py-1 rounded-md bg-[#59B83E]/10 text-[#59B83E]">02</span>
                  <span>TALENTS & PARCOURS</span>
                </div>
                
                <h3 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#101820] leading-snug">
                  Un potentiel exceptionnel <br />
                  qui réclame sa <span className="text-[#123B5D]">juste reconnaissance</span>.
                </h3>

                <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
                  Le parcours d'un talent ne se résume pas à des diplômes théoriques. Sans un passeport de compétences auditable qui atteste des projets déployés et de la fiabilité technique, l'accès aux responsabilités majeures reste semé d'obstacles arbitraires.
                </p>

                <div className="pt-2 flex items-center gap-3 text-xs font-mono text-stone-500">
                  <span className="w-2 h-2 rounded-full bg-[#123B5D]" />
                  <span>Objectif : Doter chaque talent d'une identité professionnelle inaltérable</span>
                </div>
              </motion.div>

            </div>

            {/* ========================================================
                BLOC 3 : TRANSMISSION (Texte à gauche / Image à droite)
               ======================================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative">
              
              {/* Central Connection Dot */}
              <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-[#123B5D] items-center justify-center z-20 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C8F169]" />
              </div>

              {/* Text Left */}
              <motion.div 
                initial={{ opacity: 0, x: -36 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="lg:col-span-6 space-y-5 lg:pr-6 order-2 lg:order-1"
              >
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#123B5D] uppercase tracking-wider">
                  <span className="px-2.5 py-1 rounded-md bg-[#123B5D]/10 text-[#123B5D]">03</span>
                  <span>EXPÉRIENCE & TRANSMISSION</span>
                </div>
                
                <h3 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#101820] leading-snug">
                  La transmission du savoir, <br />
                  <span className="text-[#59B83E]">clé de voûte</span> de l'autonomie.
                </h3>

                <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
                  L'expérience acquise sur le terrain par les praticiens chevronnés est inestimable. Sans passerelle structurée entre générations, cette sagesse technologique peine à irriguer les créateurs émergents, ralentissant l'élévation globale des standards industriels.
                </p>

                <div className="pt-2 flex items-center gap-3 text-xs font-mono text-stone-500">
                  <span className="w-2 h-2 rounded-full bg-[#59B83E]" />
                  <span>Mission : Bâtir des canaux directs de mentorat et d'évaluation par les pairs</span>
                </div>
              </motion.div>

              {/* Image Right */}
              <motion.div 
                initial={{ opacity: 0, x: 36, scale: 0.98 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="lg:col-span-6 order-1 lg:order-2"
              >
                <div className="relative rounded-3xl overflow-hidden bg-white p-2 sm:p-3 border border-[#E2E8E5] shadow-xl hover:shadow-2xl transition-all duration-500 group">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
                    <img 
                      src={gapTransmissionImg} 
                      alt="Transmission intergénérationnelle et mentorat technologique"
                      className="w-full h-full object-cover object-top rounded-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101820]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Mentorat direct · Accélération de la maturité technique
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* ========================================================
                BLOC 4 : OPPORTUNITÉS (Image à gauche / Texte à droite)
               ======================================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative">
              
              {/* Central Connection Dot */}
              <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-[#59B83E] items-center justify-center z-20 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#123B5D]" />
              </div>

              {/* Image Left */}
              <motion.div 
                initial={{ opacity: 0, x: -36, scale: 0.98 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="lg:col-span-6"
              >
                <div className="relative rounded-3xl overflow-hidden bg-white p-2 sm:p-3 border border-[#E2E8E5] shadow-xl hover:shadow-2xl transition-all duration-500 group">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
                    <img 
                      src={gapOpportunitiesImg} 
                      alt="Entreprises et organisations en quête de confiance vérifiable"
                      className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101820]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Organisations & Entreprises · Recrutement fondé sur la preuve
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Text Right */}
              <motion.div 
                initial={{ opacity: 0, x: 36 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="lg:col-span-6 space-y-5 lg:pl-6"
              >
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#101820] uppercase tracking-wider">
                  <span className="px-2.5 py-1 rounded-md bg-[#101820]/10 text-[#101820]">04</span>
                  <span>OPPORTUNITÉS & CONFIANCE</span>
                </div>
                
                <h3 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#101820] leading-snug">
                  Des organisations en quête <br />
                  de <span className="text-[#123B5D]">confiance vérifiable</span>.
                </h3>

                <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
                  Les entreprises africaines et globales recherchent continuellement des experts aptes à livrer des systèmes critiques. Mais sans registre transparent des compétences prouvées, le recrutement reste lent, incertain et coûteux.
                </p>

                <div className="pt-2 flex items-center gap-3 text-xs font-mono text-stone-500">
                  <span className="w-2 h-2 rounded-full bg-[#123B5D]" />
                  <span>Solution : Remplacer l'incertitude du CV par la clarté des réalisations réelles</span>
                </div>
              </motion.div>

            </div>

          </div>

          {/* ========================================================
              SECTION FINALE DU GAP : LA RÉSOLUTION PAR LE PONT
             ======================================================== */}
          <FadeInUp delay={0.2} className="mt-28 sm:mt-36">
            <div className="relative rounded-3xl bg-gradient-to-r from-[#123B5D] to-[#0A2338] text-white p-8 sm:p-14 overflow-hidden shadow-2xl border border-white/10 text-center space-y-6">
              
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#59B83E]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C8F169]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl mx-auto space-y-5">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C8F169] text-xs font-mono font-bold tracking-widest uppercase">
                  <span>LA RÉPONSE SKILLBRIDGE</span>
                </span>
                
                <h3 className="font-heading text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                  SkillBridge est né pour réduire cette distance.
                </h3>
                
                <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
                  En connectant organiquement les <strong>compétences</strong>, le <strong>talent</strong>, l'<strong>expérience</strong> et les <strong>opportunités</strong>, nous bâtissons l'infrastructure où chacun avance par la preuve.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => onNavigate('onboarding')}
                    className="sb-btn w-full sm:w-auto px-8 py-4 rounded-xl bg-[#59B83E] hover:bg-[#4ea536] text-white font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2.5 cursor-pointer group"
                  >
                    <span>Rejoindre l'écosystème</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('talents')}
                    className="sb-btn w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Explorer les profils vérifiés</span>
                  </button>
                </div>
              </div>

            </div>
          </FadeInUp>

        </div>
      </section>

      {/* 09 — THE BRIDGE MODEL */}
      <section className="relative py-24 bg-white/70 border-b border-[#E2E8E5] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <FadeInUp>
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#59B83E] block">
                THE BRIDGE MODEL
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#101820]">
                Un pont. Quatre mouvements.
              </h2>
            </div>
          </FadeInUp>

          {/* Continuous Bridge Line with 4 steps */}
          <div className="relative">
            {/* Desktop connecting line with animated BridgeConnector */}
            <div className="hidden lg:block absolute top-7 left-[10%] right-[10%] z-0">
              <BridgeConnector />
            </div>

            <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              
              {/* Step 1 */}
              <ScaleOnHover>
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8E5] space-y-4 shadow-xs h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#123B5D] text-white flex items-center justify-center font-bold text-sm">
                    01
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#101820] uppercase tracking-wider">
                    APPRENDRE
                  </h3>
                  <p className="text-sm text-stone-600 font-light leading-relaxed">
                    Acquérir les compétences qui permettent d'avancer et de répondre aux exigences de demain.
                  </p>
                </div>
              </ScaleOnHover>

              {/* Step 2 */}
              <ScaleOnHover>
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8E5] space-y-4 shadow-xs h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#59B83E] text-white flex items-center justify-center font-bold text-sm">
                    02
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#101820] uppercase tracking-wider">
                    TRANSMETTRE
                  </h3>
                  <p className="text-sm text-stone-600 font-light leading-relaxed">
                    Partager l'expérience et le savoir entre praticiens confirmés et nouvelles générations.
                  </p>
                </div>
              </ScaleOnHover>

              {/* Step 3 */}
              <ScaleOnHover>
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8E5] space-y-4 shadow-xs h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#123B5D] text-white flex items-center justify-center font-bold text-sm">
                    03
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#101820] uppercase tracking-wider">
                    PROUVER
                  </h3>
                  <p className="text-sm text-stone-600 font-light leading-relaxed">
                    Transformer ses compétences en preuves concrètes, mesurables et vérifiables par les pairs.
                  </p>
                </div>
              </ScaleOnHover>

              {/* Step 4 */}
              <ScaleOnHover>
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8E5] space-y-4 shadow-xs h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#101820] text-[#C8F169] flex items-center justify-center font-bold text-sm">
                    04
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#101820] uppercase tracking-wider">
                    ÉVOLUER
                  </h3>
                  <p className="text-sm text-stone-600 font-light leading-relaxed">
                    Accéder à de nouvelles opportunités professionnelles, projets d'envergure et collaborations.
                  </p>
                </div>
              </ScaleOnHover>

            </StaggerContainer>
          </div>

        </div>
      </section>

      {/* 10 — TALENT SECTION */}
      <section className="relative py-24 bg-white border-b border-[#E2E8E5] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left pitch */}
            <FadeInUp delay={0.1} className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#59B83E] block">
                TALENT IDENTITY
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#101820] leading-tight">
                Votre talent mérite d'être découvert.
              </h2>
              <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
                Ne réduisez plus votre parcours à un CV traditionnel. Construisez une véritable identité professionnelle numérique axée sur vos réalisations réelles, vos preuves de code, vos certifications et les recommandations de vos pairs.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('talents')}
                  className="sb-btn px-6 py-3.5 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Créer mon profil</span>
                  <ArrowRight className="w-4 h-4 text-[#C8F169]" />
                </button>
              </div>
            </FadeInUp>

            {/* Right: UI Representation of a Next-Gen Talent Profile */}
            <FadeInUp delay={0.25} className="lg:col-span-7">
              <ScaleOnHover hoverScale={1.005} liftY={-3}>
                <div className="bg-[#F5F7F6] border border-[#E2E8E5] rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
                  
                  {/* Profile Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8E5]">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#123B5D] text-white flex items-center justify-center font-bold text-lg">
                        AK
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-lg text-[#101820]">Aïcha Konaté</h4>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#59B83E]/10 text-[#59B83E] text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Vérifiée
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 font-medium">
                          Senior Systems Architect · Dakar, Sénégal
                        </p>
                      </div>
                    </div>

                    <div className="text-right sm:text-right">
                      <span className="text-[10px] text-stone-400 uppercase font-mono block">Passport Score</span>
                      <span className="text-xl font-bold font-mono text-[#123B5D]">94 / 100</span>
                    </div>
                  </div>

                  {/* Skills & Proofs */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 block">
                      Compétences & Preuves de Travail
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div className="p-3 bg-white border border-[#E2E8E5] rounded-xl space-y-1">
                        <div className="font-semibold text-[#101820]">Distributed Systems</div>
                        <div className="text-[11px] text-[#59B83E] font-medium font-mono">4 preuves vérifiées</div>
                      </div>
                      <div className="p-3 bg-white border border-[#E2E8E5] rounded-xl space-y-1">
                        <div className="font-semibold text-[#101820]">TypeScript / Go</div>
                        <div className="text-[11px] text-[#59B83E] font-medium font-mono">6 dépôts examinés</div>
                      </div>
                      <div className="p-3 bg-white border border-[#E2E8E5] rounded-xl space-y-1">
                        <div className="font-semibold text-[#101820]">PostgreSQL / RLS</div>
                        <div className="text-[11px] text-[#59B83E] font-medium font-mono">3 certifications</div>
                      </div>
                    </div>
                  </div>

                  {/* Latest Verified Project */}
                  <div className="p-4 bg-white border border-[#E2E8E5] rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#123B5D]">Projet : Panafrican Realtime Settlement Core</span>
                      <span className="text-[11px] text-stone-400 font-mono">Prod 2025</span>
                    </div>
                    <p className="text-stone-600 font-light">
                      Moteur de compensation multidevises à latence sub-seconde avec audit cryptographique.
                    </p>
                  </div>

                </div>
              </ScaleOnHover>
            </FadeInUp>

          </div>

        </div>
      </section>

      {/* 11 — SKILL PASSPORT (DARK SECTION #101820) */}
      <section className="relative py-24 bg-[#101820] text-white border-b border-stone-800 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <FadeInUp delay={0.1} className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#C8F169] text-xs font-mono font-semibold">
                <span>SKILL PASSPORT</span>
              </div>
              
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                Votre parcours. <br />
                Vos compétences. <br />
                <span className="text-[#59B83E]">Vos preuves.</span>
              </h2>

              <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
                Le Skill Passport est un document professionnel numérique nouvelle génération. Il consolide vos compétences attestées, vos projets de production, vos preuves de code et les recommandations directes de vos mentors.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('passport')}
                  className="sb-btn px-6 py-3.5 rounded-xl bg-[#59B83E] hover:bg-[#4ea536] text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Voir un exemple</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </FadeInUp>

            {/* Passport UI Card Object */}
            <FadeInUp delay={0.25} className="lg:col-span-7">
              <ScaleOnHover hoverScale={1.005} liftY={-3}>
                <div className="bg-[#123B5D]/60 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-6 shadow-2xl">
                  
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#59B83E] flex items-center justify-center font-bold text-white text-xs">
                        SP
                      </div>
                      <div>
                        <span className="text-xs font-mono tracking-widest text-[#C8F169] uppercase block">
                          PASSEPORT NUMÉRIQUE SOUVERAIN
                        </span>
                        <span className="text-xs text-stone-300">ID: SB-AFR-882910</span>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#59B83E]/20 text-[#C8F169] font-mono border border-[#59B83E]/30">
                      Statut : ACTIF
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-stone-400 block font-mono text-[10px]">SKILLS VALIDÉS</span>
                      <span className="text-base font-bold text-white font-mono">14 Compétences</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-stone-400 block font-mono text-[10px]">PREUVES DE CODE</span>
                      <span className="text-base font-bold text-[#C8F169] font-mono">19 Dépôts vérifiés</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-stone-400 block font-mono text-[10px]">MENTOR REVIEWS</span>
                      <span className="text-base font-bold text-white font-mono">8 Évaluations</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                    <span className="text-stone-300 font-mono text-[10px] uppercase tracking-wider block">
                      URL Publique Partageable
                    </span>
                    <div className="flex items-center justify-between text-stone-300 font-mono text-xs bg-black/40 px-3 py-2 rounded-lg">
                      <span>skillbridge.africa/talent/aicha-konate</span>
                      <Share2 className="w-3.5 h-3.5 text-[#C8F169]" />
                    </div>
                  </div>

                </div>
              </ScaleOnHover>
            </FadeInUp>

          </div>

        </div>
      </section>

      {/* 12 — INTERGENERATIONAL KNOWLEDGE */}
      <section className="relative py-24 bg-white/85 border-b border-[#E2E8E5] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <FadeInUp>
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#59B83E] block">
                TRANSMISSION
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#101820] leading-tight">
                L'expérience ne devrait pas s'arrêter à une génération.
              </h2>
              <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
                Nous concevons des flux directs de transmission où les professionnels établis guident, conseillent et challengent les talents émergents à travers des sessions 1-on-1 structurées.
              </p>
            </div>
          </FadeInUp>

          {/* Architectural transmission diagram */}
          <FadeInUp delay={0.2}>
            <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-[#F5F7F6] border border-[#E2E8E5] space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-[#123B5D]">SENIORITÉ & ARCHITECTURE</span>
                  <p className="text-xs text-stone-600">Partage des arbitrages d'ingénierie et de gouvernance d'entreprise.</p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="h-0.5 w-full bg-gradient-to-r from-[#123B5D] to-[#59B83E] hidden md:block" />
                  <span className="px-3 py-1 bg-white border border-[#E2E8E5] text-[#59B83E] font-bold text-xs rounded-full">
                    Flux Continu
                  </span>
                  <div className="h-0.5 w-full bg-gradient-to-r from-[#59B83E] to-[#123B5D] hidden md:block" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-[#123B5D]">TALENTS ÉMERGENTS</span>
                  <p className="text-xs text-stone-600">Accélération de la maîtrise technique et intégration industrielle.</p>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('mentors')}
                  className="sb-btn px-6 py-3.5 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white font-bold text-sm transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Découvrir les mentors</span>
                  <ArrowRight className="w-4 h-4 text-[#C8F169]" />
                </button>
              </div>
            </div>
          </FadeInUp>

        </div>
      </section>

      {/* 14 — BUSINESS SECTION (DEEP BLUE BACKGROUND #123B5D) */}
      <section className="relative py-24 bg-[#123B5D] text-white border-b border-stone-800 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <FadeInUp>
            <div className="max-w-3xl mb-16 space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C8F169] block">
                ENTREPRISES & ORGANISATIONS
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Découvrez le talent au-delà du CV.
              </h2>
              <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
                Accédez aux compétences éprouvées. Évaluez sur la base de réalisations réelles, de projets vérifiés et de recommandations authentiques.
              </p>
            </div>
          </FadeInUp>

          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScaleOnHover>
              <div className="p-8 rounded-2xl bg-white/10 border border-white/15 space-y-4 h-full">
                <span className="text-xs font-mono font-bold text-[#C8F169] uppercase tracking-wider block">
                  01 / DISCOVER
                </span>
                <h3 className="font-heading text-xl font-bold text-white">
                  Découvrez les compétences réelles
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                  Filtrez les profils par capacités techniques concrètes, stack technologique et preuves de travail vérifiées.
                </p>
              </div>
            </ScaleOnHover>

            <ScaleOnHover>
              <div className="p-8 rounded-2xl bg-white/10 border border-white/15 space-y-4 h-full">
                <span className="text-xs font-mono font-bold text-[#C8F169] uppercase tracking-wider block">
                  02 / CONNECT
                </span>
                <h3 className="font-heading text-xl font-bold text-white">
                  Entrez en relation directe
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                  Échangez sans intermédiaire avec des développeurs, data scientists et leaders d'ingénierie disponibles.
                </p>
              </div>
            </ScaleOnHover>

            <ScaleOnHover>
              <div className="p-8 rounded-2xl bg-white/10 border border-white/15 space-y-4 h-full">
                <span className="text-xs font-mono font-bold text-[#C8F169] uppercase tracking-wider block">
                  03 / OPPORTUNITIES
                </span>
                <h3 className="font-heading text-xl font-bold text-white">
                  Transformez en valeur
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                  Publiez vos opportunités ou soumettez des challenges pour recruter les talents les plus réactifs.
                </p>
              </div>
            </ScaleOnHover>
          </StaggerContainer>

          <FadeInUp delay={0.2} className="mt-12 pt-6">
            <button
              type="button"
              onClick={() => onNavigate('companies')}
              className="sb-btn px-6 py-3.5 rounded-xl bg-[#59B83E] hover:bg-[#4ea536] text-white font-bold text-sm transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Collaborer avec SkillBridge</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </FadeInUp>

        </div>
      </section>

      {/* 20 — VISION SECTION (MASSIVE WHITE SPACE) */}
      <section className="relative py-32 bg-white border-b border-[#E2E8E5] z-10">
        <FadeInUp className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#59B83E]">
            NOTRE VISION
          </span>

          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#101820] leading-snug tracking-tight">
            «Nous ne voulons pas simplement créer une plateforme. <br className="hidden sm:inline" />
            Nous voulons construire une infrastructure où les compétences africaines peuvent circuler, être découvertes et créer de nouvelles opportunités.»
          </h2>

          <div className="pt-4">
            <p className="font-editorial italic text-xl sm:text-2xl text-[#123B5D]">
              From skills to proof. From proof to opportunity.
            </p>
          </div>

        </FadeInUp>
      </section>

      {/* 21 — COMMUNITY CTA SECTION */}
      <section className="relative py-24 bg-transparent z-10">
        <FadeInUp className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#101820]">
            Soyez là dès le début.
          </h2>

          <p className="text-sm sm:text-base text-stone-600 font-light max-w-xl mx-auto leading-relaxed">
            SkillBridge est encore au commencement de son histoire. Rejoignez les premières personnes qui suivent sa construction.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Votre adresse e-mail"
              className="sb-focus w-full px-5 py-3.5 rounded-xl bg-white border border-[#E2E8E5] text-sm text-[#101820] placeholder-stone-400 focus:outline-hidden focus:border-[#123B5D]"
            />
            <button
              type="submit"
              className="sb-btn w-full sm:w-auto shrink-0 px-6 py-3.5 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{newsletterSent ? 'Inscrit avec succès ✓' : 'Rejoindre SkillBridge →'}</span>
            </button>
          </form>

        </FadeInUp>
      </section>

    </div>
  );
};

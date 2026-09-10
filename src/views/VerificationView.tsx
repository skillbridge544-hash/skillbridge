import React, { useState, useEffect } from 'react';
import { ViewType } from '../types/platform';
import { useLearning } from '../context/LearningContext';
import { UserCertificate } from '../types/learning';
import { CertificateModal } from '../components/CertificateModal';
import { FaIcon } from '../components/FaIcon';
import { 
  faShieldHalved, 
  faCertificate, 
  faCircleCheck, 
  faXmark, 
  faMagnifyingGlass, 
  faCalendarDay, 
  faCheck,
  faEye
} from '@fortawesome/free-solid-svg-icons';

interface VerificationViewProps {
  certificateId?: string;
  onNavigate?: (view: ViewType) => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  certificateId: initialCertId,
  onNavigate
}) => {
  const { verifyCertificateId, userCertificates } = useLearning();

  const [searchQuery, setSearchQuery] = useState(initialCertId || '');
  const [searchedCert, setSearchedCert] = useState<UserCertificate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-search if initialCertId provided
  useEffect(() => {
    if (initialCertId) {
      setSearchQuery(initialCertId);
      const found = verifyCertificateId(initialCertId);
      setSearchedCert(found || null);
      setHasSearched(true);
    }
  }, [initialCertId, verifyCertificateId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const found = verifyCertificateId(searchQuery.trim());
    setSearchedCert(found || null);
    setHasSearched(true);
  };

  return (
    <div className="w-full bg-[#F5F7F6] min-h-screen py-8 sm:py-14 px-4 sm:px-6 lg:px-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {onNavigate && (
          <div>
            <button
              type="button"
              onClick={() => onNavigate('certificates')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E2E8E5] bg-white text-xs font-semibold text-[#5C6B78] hover:text-[#06234B] hover:bg-stone-50 transition-colors cursor-pointer shadow-2xs"
            >
              <span>← Retour aux Certificats</span>
            </button>
          </div>
        )}

        {/* Header Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#59B83E]/10 text-[#59B83E] text-xs font-mono font-bold">
            <FaIcon icon={faShieldHalved} />
            <span>Registre Public de Certification</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#101820] tracking-tight">
            Vérification d'Authenticité SkillBridge
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
            Vérifiez instantanément la validité d'un diplôme, titre ou certificat émis par la plateforme SkillBridge en saisissant son identifiant unique.
          </p>
        </div>

        {/* Verification Search Bar */}
        <form onSubmit={handleSearch} className="bg-white rounded-3xl border border-[#E2E8E5] p-3 shadow-md flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <FaIcon icon={faMagnifyingGlass} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
            <input
              type="text"
              placeholder="Ex: SB-CERT-2026-X8F2B9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-[#123B5D]/20 focus:border-[#123B5D] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#123B5D] hover:bg-[#0A2338] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all whitespace-nowrap"
          >
            <FaIcon icon={faShieldHalved} className="text-[#59B83E]" />
            <span>Vérifier le Certificat</span>
          </button>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <div>
            {searchedCert ? (
              <div className="bg-white rounded-3xl border-2 border-[#59B83E]/40 p-6 sm:p-8 shadow-lg space-y-6 animate-fadeIn">
                
                {/* Result Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#59B83E]/10 text-[#59B83E] flex items-center justify-center text-xl">
                      <FaIcon icon={faCircleCheck} />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-[#59B83E] font-bold uppercase tracking-wider">
                        Certificat Officiel Authentifié
                      </div>
                      <h2 className="font-heading text-lg sm:text-xl font-bold text-[#101820]">
                        {searchedCert.contentTitle}
                      </h2>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#59B83E]/10 text-[#59B83E] font-mono text-xs font-bold w-fit">
                    Statut : Valide
                  </span>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  
                  <div className="p-4 rounded-2xl bg-[#FAFCFB] border border-[#E2E8E5] space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                      Titulaire du certificat
                    </div>
                    <div className="font-bold text-sm text-[#101820]">
                      {searchedCert.userName}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAFCFB] border border-[#E2E8E5] space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                      Organisme Émetteur
                    </div>
                    <div className="font-bold text-sm text-[#123B5D]">
                      {searchedCert.issuer}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAFCFB] border border-[#E2E8E5] space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                      Date de délivrance
                    </div>
                    <div className="font-bold text-sm text-stone-700 flex items-center gap-1.5">
                      <FaIcon icon={faCalendarDay} className="text-stone-400 text-xs" />
                      <span>{searchedCert.issueDate}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAFCFB] border border-[#E2E8E5] space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                      Score de réussite audité
                    </div>
                    <div className="font-mono font-bold text-sm text-[#59B83E]">
                      {searchedCert.scorePercent}%
                    </div>
                  </div>

                </div>

                {/* Validated Skills */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-400">
                    Compétences techniques certifiées
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchedCert.skillsValidated.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-xl bg-white border border-[#E2E8E5] text-xs font-mono font-bold text-[#123B5D] flex items-center gap-1.5 shadow-2xs"
                      >
                        <FaIcon icon={faCheck} className="text-[#59B83E] text-xs" />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Security Signature Proof */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                  <div className="font-mono text-[10px] text-stone-400 uppercase tracking-wider">
                    Empreinte Cryptographique du Registre
                  </div>
                  <div className="font-mono text-[11px] text-stone-700 break-all font-semibold">
                    {searchedCert.credentialFingerprint}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#123B5D] hover:bg-[#0A2338] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                  >
                    <FaIcon icon={faEye} />
                    <span>Afficher le Diplôme Officiel</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl border-2 border-rose-200 p-8 sm:p-10 text-center space-y-4 shadow-sm animate-fadeIn">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl">
                  <FaIcon icon={faXmark} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading text-lg font-bold text-rose-900">
                    Certificat introuvable
                  </h3>
                  <p className="text-xs text-rose-700/80 max-w-md mx-auto">
                    Aucun titre correspondant à l'identifiant <strong className="font-mono">{searchQuery}</strong> n'a été trouvé dans le registre officiel.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Existing Certificates Quick Select */}
        {userCertificates.length > 0 && !hasSearched && (
          <div className="space-y-4 pt-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <FaIcon icon={faCertificate} className="text-[#59B83E]" />
              <span>Vos certificats récents à tester</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userCertificates.map((cert) => (
                <button
                  key={cert.id}
                  type="button"
                  onClick={() => {
                    setSearchQuery(cert.id);
                    setSearchedCert(cert);
                    setHasSearched(true);
                  }}
                  className="p-4 rounded-2xl bg-white border border-[#E2E8E5] text-left hover:border-[#123B5D] hover:shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="space-y-1 min-w-0 pr-2">
                    <div className="font-mono text-[10px] text-[#59B83E] font-bold">
                      {cert.id}
                    </div>
                    <div className="text-xs font-bold text-[#101820] group-hover:text-[#123B5D] truncate">
                      {cert.contentTitle}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Délivré le {cert.issueDate}
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-stone-100 group-hover:bg-[#123B5D] group-hover:text-white flex items-center justify-center text-stone-400 transition-colors shrink-0">
                    <FaIcon icon={faShieldHalved} className="text-xs" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Certificate Modal */}
      <CertificateModal
        certificate={searchedCert}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

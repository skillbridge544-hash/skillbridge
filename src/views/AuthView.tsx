import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatusAlert } from '../components/StatusAlert';
import { Mail, Lock, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';

interface AuthViewProps {
  initialTab?: 'login' | 'register' | 'forgot';
  onSuccess?: (role?: 'talent' | 'mentor' | 'company') => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ initialTab = 'login', onSuccess }) => {
  const { signIn, signUp, loadDemoAccount } = useAuth();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(initialTab);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<'talent' | 'mentor' | 'company'>('talent');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');

  // Feedback & Loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage('Veuillez renseigner votre adresse e-mail et votre mot de passe.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signIn({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Identifiants incorrects ou compte introuvable.');
      } else {
        if (onSuccess) onSuccess();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur de connexion.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regFirstName.trim() || !regLastName.trim() || !regEmail.trim()) {
      setErrorMessage('Tous les champs obligatoires doivent être renseignés.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    // Validation stricte des cases à cocher obligatoires
    if (!termsAccepted || !privacyAccepted) {
      setErrorMessage('Veuillez accepter les conditions requises pour continuer.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signUp({
        email: regEmail.trim(),
        password: regPassword,
        firstName: regFirstName.trim(),
        lastName: regLastName.trim(),
        username: regEmail.split('@')[0].trim().toLowerCase(),
        accountType: regRole,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Impossible de créer le compte.');
      } else {
        setSuccessMessage('Compte initialisé avec succès ! Accès à votre espace...');
        if (onSuccess) onSuccess(regRole);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de l’inscription.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('Si un compte est associé à cette adresse, un lien de réinitialisation vous a été envoyé.');
    setTimeout(() => {
      setTab('login');
      setSuccessMessage(null);
    }, 3000);
  };

  return (
    <div className="flex-1 w-full bg-[#F5F7F6] text-[#101820] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Side: Brand Editorial Pillar */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E2E8E5] text-[#123B5D] text-xs font-mono font-bold uppercase tracking-wider">
            <span>ÉCOSYSTÈME SOUVERAIN</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#101820] tracking-tight leading-tight">
            Accédez à votre espace <span className="text-[#59B83E]">SkillBridge</span>.
          </h1>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-light">
            Gérez votre Skill Passport, vérifiez vos preuves de compétences, échangez avec des mentors et explorez les opportunités panafricaines.
          </p>

          <div className="space-y-3 pt-4 border-t border-[#E2E8E5]">
            <div className="flex items-center gap-3 text-xs text-stone-600">
              <CheckCircle2 className="w-4 h-4 text-[#59B83E] shrink-0" />
              <span>Skill Passport infalsifiable et partageable</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-600">
              <CheckCircle2 className="w-4 h-4 text-[#59B83E] shrink-0" />
              <span>Accès direct aux sessions de mentorat 1-on-1</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-600">
              <CheckCircle2 className="w-4 h-4 text-[#59B83E] shrink-0" />
              <span>Mise en relation directe avec les entreprises</span>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Card */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-[#E2E8E5] rounded-3xl p-6 sm:p-10 shadow-xl relative">
            
            {/* Feedback Alerts */}
            {errorMessage && (
              <StatusAlert
                type="error"
                message={errorMessage}
                onClose={() => setErrorMessage(null)}
                className="mb-6"
              />
            )}

            {successMessage && (
              <StatusAlert
                type="success"
                message={successMessage}
                onClose={() => setSuccessMessage(null)}
                className="mb-6"
              />
            )}

            {/* Navigation Tabs */}
            <div className="flex rounded-2xl bg-[#F5F7F6] p-1 mb-8 border border-[#E2E8E5]">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer ${
                  tab === 'login'
                    ? 'bg-[#123B5D] text-white shadow-xs'
                    : 'text-stone-500 hover:text-[#101820]'
                }`}
              >
                Se connecter
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer ${
                  tab === 'register'
                    ? 'bg-[#123B5D] text-white shadow-xs'
                    : 'text-stone-500 hover:text-[#101820]'
                }`}
              >
                Créer un compte
              </button>
            </div>

            {/* TAB: LOGIN */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#123B5D] mb-1.5">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="votre.email@domaine.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-[#101820] placeholder-stone-400 focus:outline-hidden focus:border-[#123B5D] text-xs transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#123B5D]">
                      Mot de passe
                    </label>
                    <button
                      type="button"
                      onClick={() => setTab('forgot')}
                      className="text-xs text-[#59B83E] hover:underline font-medium transition-colors cursor-pointer"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-[#101820] placeholder-stone-400 focus:outline-hidden focus:border-[#123B5D] text-xs transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 py-3.5 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {isSubmitting ? (
                    <span>Connexion en cours...</span>
                  ) : (
                    <>
                      <span>Accéder à mon espace</span>
                      <ArrowRight className="w-4 h-4 text-[#59B83E]" />
                    </>
                  )}
                </button>

                {/* Quick Demo Access Trigger */}
                <div className="pt-4 mt-4 border-t border-stone-100 space-y-2">
                  <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider text-center">
                    Ou tester en un clic
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        loadDemoAccount('talent');
                        if (onSuccess) onSuccess('talent');
                      }}
                      className="py-2 px-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white text-[11px] font-bold text-[#123B5D] transition-colors text-center shadow-2xs cursor-pointer"
                    >
                      Talent
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        loadDemoAccount('mentor');
                        if (onSuccess) onSuccess('mentor');
                      }}
                      className="py-2 px-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white text-[11px] font-bold text-[#59B83E] transition-colors text-center shadow-2xs cursor-pointer"
                    >
                      Mentor
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        loadDemoAccount('company');
                        if (onSuccess) onSuccess('company');
                      }}
                      className="py-2 px-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white text-[11px] font-bold text-[#101820] transition-colors text-center shadow-2xs cursor-pointer"
                    >
                      Entreprise
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* TAB: REGISTER */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#123B5D] mb-1">
                      Prénom <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      placeholder="Aïcha"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-[#101820] placeholder-stone-400 focus:outline-hidden focus:border-[#123B5D] text-xs transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#123B5D] mb-1">
                      Nom <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      placeholder="Konaté"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-[#101820] placeholder-stone-400 focus:outline-hidden focus:border-[#123B5D] text-xs transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#123B5D] mb-1">
                    Rôle principal <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-[#101820] text-xs focus:outline-hidden focus:border-[#123B5D]"
                  >
                    <option value="talent">Talent (Développeur, Designer, Architecte)</option>
                    <option value="mentor">Mentor (Senior Engineer, VP Product)</option>
                    <option value="company">Entreprise / Organisation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#123B5D] mb-1">
                    Adresse e-mail <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="nom@domaine.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-[#101820] placeholder-stone-400 focus:outline-hidden focus:border-[#123B5D] text-xs transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#123B5D] mb-1">
                      Mot de passe <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 6 caractères"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-[#101820] placeholder-stone-400 focus:outline-hidden focus:border-[#123B5D] text-xs transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#123B5D] mb-1">
                      Confirmation <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Répéter"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-[#101820] placeholder-stone-400 focus:outline-hidden focus:border-[#123B5D] text-xs transition-colors"
                    />
                  </div>
                </div>

                {/* CASES À COCHER OBLIGATOIRES AVEC VALIDATION STRICTE */}
                <div className="space-y-3 pt-3 pb-1 border-t border-[#E2E8E5]/80 text-left">
                  <div className="flex items-start gap-3">
                    <input
                      id="sb-terms-checkbox"
                      type="checkbox"
                      required
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded-md border-[#CBD5E1] text-[#59B83E] focus:ring-[#59B83E] focus:ring-offset-1 cursor-pointer shrink-0 accent-[#59B83E]"
                    />
                    <label
                      htmlFor="sb-terms-checkbox"
                      className="text-xs text-stone-600 leading-snug cursor-pointer select-none"
                    >
                      J'accepte les{' '}
                      <span className="text-[#123B5D] font-semibold underline decoration-[#59B83E]/40 hover:text-[#59B83E]">
                        Conditions d'utilisation
                      </span>{' '}
                      <span className="text-rose-500 font-bold">*</span>
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      id="sb-privacy-checkbox"
                      type="checkbox"
                      required
                      checked={privacyAccepted}
                      onChange={(e) => setPrivacyAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded-md border-[#CBD5E1] text-[#59B83E] focus:ring-[#59B83E] focus:ring-offset-1 cursor-pointer shrink-0 accent-[#59B83E]"
                    />
                    <label
                      htmlFor="sb-privacy-checkbox"
                      className="text-xs text-stone-600 leading-snug cursor-pointer select-none"
                    >
                      J'accepte la{' '}
                      <span className="text-[#123B5D] font-semibold underline decoration-[#59B83E]/40 hover:text-[#59B83E]">
                        Politique de confidentialité
                      </span>{' '}
                      <span className="text-rose-500 font-bold">*</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 py-3.5 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {isSubmitting ? (
                    <span>Création du profil...</span>
                  ) : (
                    <>
                      <span>Créer mon profil</span>
                      <ArrowRight className="w-4 h-4 text-[#C8F169]" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB: FORGOT */}
            {tab === 'forgot' && (
              <form onSubmit={handleForgot} className="space-y-4">
                <p className="text-xs text-stone-600 leading-relaxed mb-4 font-light">
                  Saisissez votre adresse e-mail pour recevoir le lien de réinitialisation sécurisé.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#123B5D] mb-1.5">
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="nom@domaine.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-[#101820] placeholder-stone-400 focus:outline-hidden focus:border-[#123B5D] text-xs transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <KeyRound className="w-4 h-4 text-[#C8F169]" />
                  <span>Envoyer le lien de récupération</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="text-xs text-stone-500 hover:text-[#101820] transition-colors cursor-pointer"
                  >
                    ← Retour à la connexion
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

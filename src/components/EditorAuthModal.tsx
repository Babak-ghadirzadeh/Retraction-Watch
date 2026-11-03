import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  UserCheck,
  BookOpen,
  Mail,
  Award,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Building2,
  LogOut,
  ExternalLink,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { EditorProfile } from '../types/academic';

interface EditorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: EditorProfile;
  onSaveProfile: (profile: EditorProfile) => void;
}

export const EditorAuthModal: React.FC<EditorAuthModalProps> = ({
  isOpen,
  onClose,
  editor,
  onSaveProfile,
}) => {
  // Modes: 'signin', 'signup', or 'manage' (if already signed in)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(
    editor.isLoggedIn ? 'signin' : 'signin'
  );
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  // Form states
  const [name, setName] = useState(editor.name || '');
  const [email, setEmail] = useState(editor.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [journal, setJournal] = useState(editor.journal || 'The Lancet');
  const [role, setRole] = useState(editor.role || 'Senior Integrity Editor');
  const [orcid, setOrcid] = useState(editor.orcid || '');
  const [institution, setInstitution] = useState(editor.institution || '');
  const [rememberMe, setRememberMe] = useState(true);

  // Status & error feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsEditingExisting(false);
      setName(editor.name || '');
      setEmail(editor.email || '');
      setJournal(editor.journal || 'The Lancet');
      setRole(editor.role || 'Senior Integrity Editor');
      setOrcid(editor.orcid || '');
      setInstitution(editor.institution || '');
      setPassword('');
      setConfirmPassword('');
    }
  }, [isOpen, editor]);

  if (!isOpen) return null;

  // Handle Email Sign In Submission
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.editor) {
        onSaveProfile(data.editor);
        setSuccessMessage('Editorial session verified');
        setTimeout(() => onClose(), 600);
      } else {
        setErrorMessage(data.error || 'Invalid editorial email or password');
      }
    } catch (err: any) {
      // Local demo fallback if backend offline
      if (email.trim()) {
        const profile: EditorProfile = {
          name: name.trim() || 'Dr. Arthur Campbell',
          email: email.trim(),
          journal: journal.trim(),
          role: role.trim(),
          orcid: orcid.trim(),
          authProvider: 'email',
          isLoggedIn: true,
        };
        onSaveProfile(profile);
        onClose();
      } else {
        setErrorMessage('Unable to contact authentication service.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Email Sign Up Submission
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          journal: journal.trim(),
          role: role.trim(),
          orcid: orcid.trim() || undefined,
          institution: institution.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.editor) {
        onSaveProfile(data.editor);
        setSuccessMessage('Account created and signed in successfully!');
        setTimeout(() => onClose(), 700);
      } else {
        setErrorMessage(data.error || 'Registration failed');
      }
    } catch (err: any) {
      // Local fallback
      const newProfile: EditorProfile = {
        name: name.trim(),
        email: email.trim(),
        journal: journal.trim(),
        role: role.trim(),
        orcid: orcid.trim(),
        institution: institution.trim(),
        authProvider: 'email',
        isLoggedIn: true,
      };
      onSaveProfile(newProfile);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {editor.isLoggedIn && !isEditingExisting
                  ? 'Active Editorial Session'
                  : authMode === 'signup'
                  ? 'Create Editor Account'
                  : 'Journal Editor Sign In'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Institutional credentials for retraction audit logs & corrigenda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Active Logged-In Card View */}
          {editor.isLoggedIn && !isEditingExisting ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-base shadow-xs">
                      {editor.name.charAt(0) || 'E'}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-base block">
                        {editor.name}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium block mt-0.5">
                        {editor.role} · {editor.journal}
                      </span>
                      <span className="text-xs text-slate-500 font-mono block mt-0.5">
                        {editor.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Logged-In User */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onSaveProfile({
                      name: 'Guest Editor',
                      email: '',
                      journal: '',
                      role: 'Guest',
                      orcid: '',
                      isLoggedIn: false,
                      authProvider: 'guest',
                    });
                    onClose();
                  }}
                  className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 dark:hover:text-rose-400 font-medium py-1.5 px-3 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingExisting(true)}
                    className="text-xs px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Edit Affiliations
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Feedback banners */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Tab Selector: Sign In vs Sign Up */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    authMode === 'signin'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sign In (Existing Editor)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Register New Account
                </button>
              </div>

              {/* Sign In Form */}
              {authMode === 'signin' && (
                <form onSubmit={handleEmailSignIn} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Institutional Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="editor@thelancet.com"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setPassword('editorial2026')}
                        className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:underline cursor-pointer"
                      >
                        Use default demo pwd
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-slate-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                      />
                      <span>Keep me signed in</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 disabled:opacity-60 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmitting ? 'Authenticating...' : 'Sign In as Journal Editor'}</span>
                  </button>
                </form>
              )}

              {/* Sign Up Form */}
              {authMode === 'signup' && (
                <form onSubmit={handleEmailSignUp} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name & Academic Title
                    </label>
                    <div className="relative">
                      <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Dr. Elena Rostova"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Institutional Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.rostova@cochrane-evidence.org"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Primary Journal
                      </label>
                      <div className="relative">
                        <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={journal}
                          onChange={(e) => setJournal(e.target.value)}
                          placeholder="e.g. The Lancet"
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Editorial Role
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-slate-400 focus:outline-none"
                      >
                        <option value="Editor-in-Chief">Editor-in-Chief</option>
                        <option value="Senior Integrity Editor">Senior Integrity Editor</option>
                        <option value="Associate / Section Editor">Associate / Section Editor</option>
                        <option value="Managing Editor">Managing Editor</option>
                        <option value="Editorial Board Member">Editorial Board Member</option>
                        <option value="Peer Review Coordinator">Peer Review Coordinator</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        ORCID iD (Optional)
                      </label>
                      <div className="relative">
                        <Award className="w-4 h-4 text-[#A6CE39] absolute left-3 top-3" />
                        <input
                          type="text"
                          value={orcid}
                          onChange={(e) => setOrcid(e.target.value)}
                          placeholder="0000-0003-4921-8842"
                          className="w-full pl-9 pr-3 py-2 text-sm font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Institution / Affiliation
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          placeholder="Oxford University / NHS"
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Password (min 6 chars)
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 disabled:opacity-60 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmitting ? 'Creating Editorial Profile...' : 'Complete Registration & Sign In'}</span>
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

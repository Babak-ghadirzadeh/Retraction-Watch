import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  UserCheck,
  Mail,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { EditorProfile } from '../types/academic';
import {
  launchGoogleAuth,
  launchOrcidAuth,
  OAuthUserData,
} from '../utils/oauthClient';

interface EditorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: EditorProfile;
  onSaveProfile: (profile: EditorProfile) => void;
}

const STORAGE_REMEMBERED_KEY = 'retractscan_remembered_credentials';

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

  // Reset or pre-fill form when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsEditingExisting(false);
      setName(editor.isLoggedIn ? (editor.name || '') : '');
      setJournal(editor.isLoggedIn ? (editor.journal || 'The Lancet') : 'The Lancet');
      setRole(editor.isLoggedIn ? (editor.role || 'Senior Integrity Editor') : 'Senior Integrity Editor');
      setOrcid(editor.isLoggedIn ? (editor.orcid || '') : '');
      setInstitution(editor.isLoggedIn ? (editor.institution || '') : '');

      if (editor.isLoggedIn) {
        setEmail(editor.email || '');
        setPassword('');
      } else {
        // Pre-fill remembered credentials if available
        try {
          const remembered = localStorage.getItem(STORAGE_REMEMBERED_KEY);
          if (remembered) {
            const creds = JSON.parse(remembered);
            if (creds?.email) setEmail(creds.email);
            if (creds?.password) setPassword(creds.password);
            if (creds?.name && !name) setName(creds.name);
          } else {
            setEmail(editor.email || '');
            setPassword('');
          }
        } catch {
          setEmail(editor.email || '');
          setPassword('');
        }
      }
      setConfirmPassword('');
    }
  }, [isOpen, editor]);

  // Listen for OAuth popup completion
  useEffect(() => {
    if (!isOpen) return;

    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      const isAllowedOrigin =
        !origin ||
        origin === 'null' ||
        origin === window.location.origin ||
        origin.endsWith('.run.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1');

      if (!isAllowedOrigin) return;

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const provider = event.data.provider || 'google';
        completeOAuthSession(provider, {
          name: event.data.name,
          email: event.data.email,
          orcid: event.data.orcid,
          journal: event.data.journal,
          role: event.data.role,
          institution: event.data.institution,
        });
      }
    };

    // Cross-tab and mobile storage event listener
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === 'retractscan_oauth_complete' && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (parsed?.type === 'OAUTH_AUTH_SUCCESS') {
            const provider = parsed.provider || 'google';
            completeOAuthSession(provider, {
              name: parsed.name,
              email: parsed.email,
              orcid: parsed.orcid,
              journal: parsed.journal,
              role: parsed.role,
              institution: parsed.institution,
            });
          }
        } catch (e) {}
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    window.addEventListener('storage', handleStorageEvent);
    return () => {
      window.removeEventListener('message', handleOAuthMessage);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [isOpen, authMode]);

  const completeOAuthSession = async (
    provider: 'google' | 'orcid',
    details?: Partial<OAuthUserData>
  ) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const defaultName = details?.name || (provider === 'orcid' ? 'Babak Ghadirzadeh, M.D.' : 'Babak Ghadirzadeh');
    const defaultEmail = details?.email || (provider === 'orcid' ? 'ghadirzadeh.babak@gmail.com' : 'ghadirzadeh.babak@gmail.com');
    const defaultOrcid = details?.orcid || (provider === 'orcid' ? '0000-0001-8492-3321' : '0000-0001-8492-3321');
    const defaultJournal = details?.journal || journal || 'The Lancet';
    const defaultRole = details?.role || role || 'Senior Integrity Editor';
    const defaultInstitution = details?.institution || (provider === 'orcid' ? 'Kurdistan University of Medical Sciences' : 'Google Identity Verified');

    try {
      const res = await fetch('/api/auth/federated', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          name: defaultName,
          email: defaultEmail,
          orcid: defaultOrcid,
          journal: defaultJournal,
          role: defaultRole,
          institution: defaultInstitution,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.editor) {
        onSaveProfile(data.editor);
        setSuccessMessage(`Authenticated as ${data.editor.name}`);
        setTimeout(() => onClose(), 400);
      } else {
        const profile: EditorProfile = {
          name: defaultName,
          email: defaultEmail,
          journal: defaultJournal,
          role: defaultRole,
          orcid: defaultOrcid,
          authProvider: provider,
          institution: defaultInstitution,
          isLoggedIn: true,
        };
        onSaveProfile(profile);
        onClose();
      }
    } catch {
      const profile: EditorProfile = {
        name: defaultName,
        email: defaultEmail,
        journal: defaultJournal,
        role: defaultRole,
        orcid: defaultOrcid,
        authProvider: provider,
        institution: defaultInstitution,
        isLoggedIn: true,
      };
      onSaveProfile(profile);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleClick = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    launchGoogleAuth({
      mode: authMode,
      onSuccess: (data) => completeOAuthSession('google', data),
      onError: (err) => setErrorMessage(err),
    });
  };

  const handleOrcidClick = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    launchOrcidAuth({
      mode: authMode,
      onSuccess: (data) => completeOAuthSession('orcid', data),
      onError: (err) => setErrorMessage(err),
    });
  };

  if (!isOpen) return null;

  const saveAccountCredentialsLocally = (acc: {
    email: string;
    password?: string;
    name?: string;
    [key: string]: any;
  }) => {
    try {
      if (rememberMe) {
        localStorage.setItem(
          STORAGE_REMEMBERED_KEY,
          JSON.stringify({
            email: acc.email,
            password: acc.password || password,
            name: acc.name || name,
          })
        );
      } else {
        localStorage.removeItem(STORAGE_REMEMBERED_KEY);
      }
    } catch (e) {
      console.warn('Could not save credentials locally:', e);
    }
  };

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
        saveAccountCredentialsLocally({
          email: email.trim(),
          password,
          name: data.editor.name,
          journal: data.editor.journal,
          role: data.editor.role,
        });
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
        saveAccountCredentialsLocally({
          email: email.trim(),
          password,
          name: profile.name,
          journal: profile.journal,
          role: profile.role,
        });
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
        saveAccountCredentialsLocally({
          email: email.trim(),
          password,
          name: name.trim(),
          journal: journal.trim(),
          role: role.trim(),
          orcid: orcid.trim(),
          institution: institution.trim(),
        });
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
      saveAccountCredentialsLocally({
        email: email.trim(),
        password,
        name: name.trim(),
        journal: journal.trim(),
        role: role.trim(),
        orcid: orcid.trim(),
        institution: institution.trim(),
      });
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

              {/* Google & ORCID Authentication Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleGoogleClick}
                  className="w-full flex items-center justify-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-900 dark:text-white text-xs font-semibold shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 cursor-pointer"
                  title={authMode === 'signup' ? 'Create editorial account with Google Identity' : 'Sign in with Google'}
                >
                  <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{authMode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleOrcidClick}
                  className="w-full flex items-center justify-center gap-2.5 px-3 py-2 rounded-xl border border-[#A6CE39]/70 bg-gradient-to-r from-emerald-50/50 to-lime-50/30 dark:from-emerald-950/20 dark:to-lime-950/10 hover:border-[#A6CE39] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-900 dark:text-white text-xs font-semibold shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 cursor-pointer"
                  title={authMode === 'signup' ? 'Create editorial account with verified ORCID iD' : 'Sign in with ORCID'}
                >
                  <span className="w-4 h-4 rounded-full bg-[#A6CE39] text-white flex items-center justify-center font-bold text-[9px] shrink-0 shadow-2xs">
                    iD
                  </span>
                  <span>{authMode === 'signup' ? 'Sign up with ORCID' : 'Sign in with ORCID'}</span>
                </button>
              </div>

              {/* Visual Divider */}
              <div className="relative flex items-center justify-center pt-1">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-medium text-slate-400 uppercase tracking-wider shrink-0">
                  Or with editorial email
                </span>
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              </div>

              {/* Sign In Form */}
              {authMode === 'signin' && (
                <form
                  method="post"
                  action="#"
                  autoComplete="on"
                  onSubmit={handleEmailSignIn}
                  className="space-y-3.5"
                >
                  <div>
                    <label
                      htmlFor="modal-login-email"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Institutional Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="modal-login-email"
                        name="email"
                        type="email"
                        autoComplete="username"
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
                      <label
                        htmlFor="modal-login-password"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Password
                      </label>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="modal-login-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
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
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                      />
                      <span>Save & remember my login on this device</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 disabled:opacity-60 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
                  </button>
                </form>
              )}

              {/* Sign Up Form */}
              {authMode === 'signup' && (
                <form
                  method="post"
                  action="#"
                  autoComplete="on"
                  onSubmit={handleEmailSignUp}
                  className="space-y-3"
                >
                  <div>
                    <label
                      htmlFor="modal-reg-name"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="modal-reg-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dr. Jane Doe"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="modal-reg-email"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="modal-reg-email"
                        name="email"
                        type="email"
                        autoComplete="username"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@organization.edu"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="modal-reg-password"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Password (min 6 chars)
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          id="modal-reg-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="modal-reg-confirmpassword"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          id="modal-reg-confirmpassword"
                          name="confirm-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                      />
                      <span>Save & remember my login on this device</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 disabled:opacity-60 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
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

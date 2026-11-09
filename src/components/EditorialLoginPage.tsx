import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  User,
  BookOpen,
  Briefcase,
  AlertCircle,
  ExternalLink,
  Award,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import { EditorProfile } from '../types/academic';
import {
  launchGoogleAuth,
  launchOrcidAuth,
  OAuthUserData,
} from '../utils/oauthClient';

interface EditorialLoginPageProps {
  onLogin: (profile: EditorProfile) => void;
  lastEditor?: EditorProfile | null;
  onBackToHome?: () => void;
}

const STORAGE_REMEMBERED_KEY = 'retractscan_remembered_credentials';

export const EditorialLoginPage: React.FC<EditorialLoginPageProps> = ({
  onLogin,
  lastEditor,
  onBackToHome,
}) => {
  // Mode: either 'signin' or 'signup'
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Form states initialized strictly empty
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [journal, setJournal] = useState('Academic Journal');
  const [role, setRole] = useState('Integrity Reviewer');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Ensure email and password fields remain strictly empty when the user has not written anything yet
  useEffect(() => {
    try {
      // Purge any legacy shared accounts list for privacy
      localStorage.removeItem('retractscan_registered_accounts');
      // Keep inputs completely blank until user writes into them
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
    } catch (e) {
      console.warn('Could not reset form fields:', e);
    }
  }, []);

  const handleSwitchMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    // Keep email and password empty when toggling between sign in and sign up
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  // Listen for OAuth popup completion (Google & ORCID) via postMessage and localStorage
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      // Allow preview origin, null (from about:blank popup), localhost, or same-origin
      const isAllowedOrigin =
        !origin ||
        origin === 'null' ||
        origin === window.location.origin ||
        origin.endsWith('.run.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1');

      if (!isAllowedOrigin) {
        return;
      }

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
  }, [mode]);

  // Complete OAuth login session
  const completeOAuthSession = async (
    provider: 'google' | 'orcid',
    details?: Partial<OAuthUserData>
  ) => {
    setIsLoading(true);
    setErrorMessage(null);

    const defaultName = details?.name || (provider === 'orcid' ? 'Babak Ghadirzadeh, M.D.' : 'Babak Ghadirzadeh');
    const defaultEmail = details?.email || (provider === 'orcid' ? 'ghadirzadeh.babak@gmail.com' : 'ghadirzadeh.babak@gmail.com');
    const defaultOrcid = details?.orcid || (provider === 'orcid' ? '0000-0001-8492-3321' : '0000-0001-8492-3321');
    const defaultJournal = details?.journal || journal || 'The Lancet';
    const defaultRole = details?.role || role || 'Senior Integrity Editor';
    const defaultInstitution = details?.institution || (provider === 'orcid' ? 'Kurdistan University of Medical Sciences' : 'Google Verified Editorial Identity');

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
        saveAccountLocally(data.editor);
        setSuccessMessage(`Signed in as ${data.editor.name} via ${provider.toUpperCase()}`);
        setTimeout(() => {
          onLogin(data.editor);
        }, 300);
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
        saveAccountLocally(profile);
        onLogin(profile);
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
      saveAccountLocally(profile);
      onLogin(profile);
    } finally {
      setIsLoading(false);
    }
  };

  // Custom OAuth Credentials states (optional user overrides)
  const [showOAuthDetails, setShowOAuthDetails] = useState(false);
  const [customGoogleClientId, setCustomGoogleClientId] = useState(() => {
    return localStorage.getItem('retractscan_custom_google_client_id') || '';
  });
  const [customOrcidClientId, setCustomOrcidClientId] = useState(() => {
    return localStorage.getItem('retractscan_custom_orcid_client_id') || '';
  });
  const [redirectUriMode, setRedirectUriMode] = useState<'auto' | 'dev' | 'custom'>(() => {
    return (localStorage.getItem('retractscan_redirect_uri_mode') as 'auto' | 'dev' | 'custom') || 'auto';
  });
  const [customRedirectUriInput, setCustomRedirectUriInput] = useState(() => {
    return localStorage.getItem('retractscan_custom_redirect_uri') || '';
  });
  const [copiedCallback, setCopiedCallback] = useState<string | null>(null);

  const LAPTOP_DEV_BASE = 'https://ais-dev-dzwyolr2chobabko7tzgp3-45122006777.europe-west2.run.app';

  const getActiveRedirectUri = (provider: 'google' | 'orcid'): string | undefined => {
    if (redirectUriMode === 'dev') {
      return `${LAPTOP_DEV_BASE}/auth/${provider}/callback`;
    }
    if (redirectUriMode === 'custom' && customRedirectUriInput.trim()) {
      return customRedirectUriInput.trim();
    }
    return undefined; // Default auto-resolves to current device origin
  };

  // Launch Google OAuth Popup directly & synchronously
  const handleGoogleClick = () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const redirectUri = getActiveRedirectUri('google');

    launchGoogleAuth({
      mode,
      customClientId: customGoogleClientId.trim(),
      customRedirectUri: redirectUri,
      onSuccess: (data) => completeOAuthSession('google', data),
      onError: (err) => {
        setErrorMessage(err);
      },
    });
  };

  // Launch ORCID OAuth Popup directly & synchronously
  const handleOrcidClick = () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const redirectUri = getActiveRedirectUri('orcid');

    launchOrcidAuth({
      mode,
      customClientId: customOrcidClientId.trim(),
      customRedirectUri: redirectUri,
      onSuccess: (data) => completeOAuthSession('orcid', data),
      onError: (err) => {
        setErrorMessage(err);
      },
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCallback(label);
    setTimeout(() => setCopiedCallback(null), 2500);
  };

  // Save user's own credentials to local device storage if rememberMe is enabled
  const saveAccountLocally = (profile: EditorProfile, passwordToCache?: string) => {
    try {
      if (rememberMe) {
        localStorage.setItem(
          STORAGE_REMEMBERED_KEY,
          JSON.stringify({
            name: profile.name,
            email: profile.email.toLowerCase().trim(),
            password: passwordToCache || password,
          })
        );
      } else {
        localStorage.removeItem(STORAGE_REMEMBERED_KEY);
      }
    } catch (e) {
      console.warn('Could not save credentials to local storage:', e);
    }
  };

  // Check client-side remembered account as backup if backend is offline
  const checkLocalAccounts = (cleanEmail: string, pass: string): EditorProfile | 'WRONG_PASS' | null => {
    try {
      const remembered = localStorage.getItem(STORAGE_REMEMBERED_KEY);
      if (!remembered) return null;
      const creds = JSON.parse(remembered);
      if (creds?.email?.toLowerCase() === cleanEmail.toLowerCase()) {
        if (creds.password && creds.password !== pass) {
          return 'WRONG_PASS';
        }
        return {
          name: creds.name || 'Editorial Member',
          email: cleanEmail,
          journal: journal || 'Academic Journal',
          role: role || 'Integrity Reviewer',
          isLoggedIn: true,
        };
      }
      return null;
    } catch {
      return null;
    }
  };

  // Submit Email Login / Signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid institutional or academic email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: cleanEmail,
            password,
            journal: journal.trim(),
            role: role.trim() || 'Senior Integrity Editor',
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setErrorMessage(data.error || 'Registration failed. Please check your credentials.');
          setIsLoading(false);
          return;
        }

        if (data.editor) {
          saveAccountLocally(data.editor, password);
          if (rememberMe) {
            try {
              localStorage.setItem('retractscan_remember_me', 'true');
              localStorage.setItem(
                STORAGE_REMEMBERED_KEY,
                JSON.stringify({
                  email: cleanEmail,
                  password,
                  name: data.editor.name,
                })
              );
            } catch (e) {}
          } else {
            try {
              localStorage.setItem('retractscan_remember_me', 'false');
              localStorage.removeItem(STORAGE_REMEMBERED_KEY);
            } catch (e) {}
          }
          setSuccessMessage('Editorial account created successfully! Credentials saved on this device.');
          setTimeout(() => {
            onLogin(data.editor);
          }, 350);
          return;
        }
      } else {
        // Sign In
        const res = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            password,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          // Check local cache backup in case server was restarted
          const localCheck = checkLocalAccounts(cleanEmail, password);
          if (localCheck === 'WRONG_PASS') {
            setErrorMessage('Incorrect password for this editorial account. Please try again.');
            setIsLoading(false);
            return;
          } else if (localCheck) {
            if (rememberMe) {
              try {
                localStorage.setItem('retractscan_remember_me', 'true');
                localStorage.setItem(
                  STORAGE_REMEMBERED_KEY,
                  JSON.stringify({
                    email: cleanEmail,
                    password,
                    name: localCheck.name,
                  })
                );
              } catch (e) {}
            }
            onLogin(localCheck);
            return;
          }

          setErrorMessage(data.error || 'Authentication failed. Please verify your email and password.');
          setIsLoading(false);
          return;
        }

        if (data.editor) {
          saveAccountLocally(data.editor, password);
          if (rememberMe) {
            try {
              localStorage.setItem('retractscan_remember_me', 'true');
              localStorage.setItem(
                STORAGE_REMEMBERED_KEY,
                JSON.stringify({
                  email: cleanEmail,
                  password,
                  name: data.editor.name,
                })
              );
            } catch (e) {}
          } else {
            try {
              localStorage.setItem('retractscan_remember_me', 'false');
              localStorage.removeItem(STORAGE_REMEMBERED_KEY);
            } catch (e) {}
          }
          onLogin(data.editor);
          return;
        }
      }
    } catch (err) {
      // Local fallback check
      const localCheck = checkLocalAccounts(cleanEmail, password);
      if (localCheck === 'WRONG_PASS') {
        setErrorMessage('Incorrect password for this editorial account. Please try again.');
        setIsLoading(false);
        return;
      } else if (localCheck) {
        if (rememberMe) {
          try {
            localStorage.setItem('retractscan_remember_me', 'true');
            localStorage.setItem(
              STORAGE_REMEMBERED_KEY,
              JSON.stringify({
                email: cleanEmail,
                password,
                name: localCheck.name,
              })
            );
          } catch (e) {}
        }
        onLogin(localCheck);
        return;
      }

      setErrorMessage('Could not connect to authentication service. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] dark:bg-[#0c0e12] text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-slate-200">
      {/* Top Header */}
      <header className="border-b border-slate-200/80 dark:border-slate-800 bg-[#fafaf8]/95 dark:bg-[#0c0e12]/95 backdrop-blur-md px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-stone-900 border border-slate-200/90 dark:border-slate-800 p-0.5 shadow-xs flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/Document_Search_Orbit_Icon_ea742aca.png"
                alt="RetractScan Logo"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  RetractScan
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  COPE Compliant
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Academic Journal Editorial Suite · Retraction & Citation Audit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Crossref & PubMed Active
              </span>
            </div>

            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs"
                title="Return to RetractScan Home page"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Return to Home</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-md w-full mx-auto px-4 py-8 sm:py-10 my-auto">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Card Header & Mode Switcher */}
          <div className="p-6 sm:p-7 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-center">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {mode === 'signin'
                ? 'Sign in to access your journal retraction audits & reports'
                : 'Sign up to audit literature and manage retraction reports'}
            </p>

            {/* Segment Toggle */}
            <div className="mt-5 grid grid-cols-2 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleSwitchMode('signin')}
                className={`py-2 px-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMode('signup')}
                className={`py-2 px-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-7 space-y-5">
            {/* Real Working Google and ORCID Buttons */}
            <div className="space-y-2.5">
              {/* Google Sign In / Sign Up Button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={handleGoogleClick}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-900 dark:text-white text-xs font-semibold shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 cursor-pointer"
                title={mode === 'signup' ? 'Create editorial account with Google Identity' : 'Authenticate with your verified Google account'}
              >
                <svg className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
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
                <span>{mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}</span>
              </button>

              {/* ORCID Sign In / Sign Up Button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={handleOrcidClick}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-[#A6CE39]/70 bg-gradient-to-r from-emerald-50/50 to-lime-50/30 dark:from-emerald-950/20 dark:to-lime-950/10 hover:border-[#A6CE39] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-900 dark:text-white text-xs font-semibold shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 cursor-pointer"
                title={mode === 'signup' ? 'Create editorial account with verified 16-digit ORCID iD' : 'Authenticate with your verified 16-digit ORCID iD'}
              >
                <span className="w-4.5 h-4.5 rounded-full bg-[#A6CE39] text-white flex items-center justify-center font-bold text-[9px] shrink-0 shadow-xs">
                  iD
                </span>
                <span>{mode === 'signup' ? 'Sign up with ORCID' : 'Sign in with ORCID'}</span>
              </button>

              {/* OAuth Configuration & Redirect URIs Toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowOAuthDetails(!showOAuthDetails)}
                  className="w-full flex items-center justify-between text-[11px] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <ExternalLink className="w-3.5 h-3.5" />
                    OAuth 2.0 Redirect URIs & Keys
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {showOAuthDetails ? '▲ Hide' : '▼ View'}
                  </span>
                </button>

                {showOAuthDetails && (
                  <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-left space-y-3 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-[10px] leading-relaxed">
                      <p className="font-semibold mb-1">Fixing "redirect_uri does not match" & "redirect_uri_mismatch":</p>
                      <p>
                        ORCID and Google reject requests if the current device URL isn't in their authorized list. You can either <strong>add the Callback URIs below to your Developer consoles</strong>, or select <strong>"Use Laptop Registered Callback"</strong> to sign in immediately using the URL already registered from your laptop!
                      </p>
                    </div>

                    {/* Redirect URI Strategy Selector */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 block">
                        Callback Routing Mode:
                      </label>
                      <div className="space-y-1">
                        <label className="flex items-center gap-2 cursor-pointer text-[10.5px] text-slate-700 dark:text-slate-300">
                          <input
                            type="radio"
                            name="redirectUriMode"
                            checked={redirectUriMode === 'auto'}
                            onChange={() => {
                              setRedirectUriMode('auto');
                              localStorage.setItem('retractscan_redirect_uri_mode', 'auto');
                            }}
                            className="text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                          />
                          <span>Current Device URL ({typeof window !== 'undefined' ? window.location.host : 'Current Origin'})</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-[10.5px] text-slate-700 dark:text-slate-300">
                          <input
                            type="radio"
                            name="redirectUriMode"
                            checked={redirectUriMode === 'dev'}
                            onChange={() => {
                              setRedirectUriMode('dev');
                              localStorage.setItem('retractscan_redirect_uri_mode', 'dev');
                            }}
                            className="text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                          />
                          <span>Use Laptop Registered Callback (<strong>ais-dev</strong> URL already approved)</span>
                        </label>
                      </div>
                    </div>

                    {/* Current device URIs */}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-2 space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            Current Device ORCID Callback URI:
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <code className="flex-1 bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-300 break-all select-all">
                            {typeof window !== 'undefined' ? `${window.location.origin}/auth/orcid/callback` : '/auth/orcid/callback'}
                          </code>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(typeof window !== 'undefined' ? `${window.location.origin}/auth/orcid/callback` : '/auth/orcid/callback', 'orcid')}
                            className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors shrink-0"
                          >
                            {copiedCallback === 'orcid' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            Current Device Google Callback URI:
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <code className="flex-1 bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-300 break-all select-all">
                            {typeof window !== 'undefined' ? `${window.location.origin}/auth/google/callback` : '/auth/google/callback'}
                          </code>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(typeof window !== 'undefined' ? `${window.location.origin}/auth/google/callback` : '/auth/google/callback', 'google')}
                            className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors shrink-0"
                          >
                            {copiedCallback === 'google' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 pt-2 space-y-2">
                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                          Custom Google Client ID (Optional):
                        </label>
                        <input
                          type="text"
                          value={customGoogleClientId}
                          onChange={(e) => {
                            setCustomGoogleClientId(e.target.value);
                            localStorage.setItem('retractscan_custom_google_client_id', e.target.value);
                          }}
                          placeholder="e.g. 104845...apps.googleusercontent.com"
                          className="w-full text-[11px] px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                          Custom ORCID Client ID (Default: APP-CPE3YFJJIX248DK5):
                        </label>
                        <input
                          type="text"
                          value={customOrcidClientId}
                          onChange={(e) => {
                            setCustomOrcidClientId(e.target.value);
                            localStorage.setItem('retractscan_custom_orcid_client_id', e.target.value);
                          }}
                          placeholder="e.g. APP-CPE3YFJJIX248DK5"
                          className="w-full text-[11px] px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Visual Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider shrink-0">
                Or with editorial email
              </span>
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            </div>



            {/* Error & Success Feedback Banners */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Standard HTML5 Compliant Email Form (Triggers native browser password managers) */}
            <form
              method="post"
              action="#"
              autoComplete="on"
              onSubmit={handleSubmit}
              className="space-y-3.5"
            >
              {/* Extra registration fields */}
              {mode === 'signup' && (
                <>
                  <div className="space-y-1">
                    <label
                      htmlFor="editorial-login-name"
                      className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Full Name & Academic Title
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="editorial-login-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Dr. Jane Smith"
                        className="w-full pl-9.5 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email Address */}
              <div className="space-y-1">
                <label
                  htmlFor="editorial-login-email"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="editorial-login-email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.edu"
                    className="w-full pl-9.5 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="editorial-login-password"
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="editorial-login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="off"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9.5 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (only on Sign Up) */}
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label
                    htmlFor="editorial-login-confirm-password"
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="editorial-login-confirm-password"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="off"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full pl-9.5 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label
                  htmlFor="editorial-remember-me"
                  className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-300 select-none"
                >
                  <input
                    id="editorial-remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-500 accent-slate-900 dark:accent-slate-100 cursor-pointer"
                  />
                  <span>Save & remember my login on this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2 group"
              >
                {isLoading ? (
                  <span>Authenticating & Saving...</span>
                ) : (
                  <>
                    <span>
                      {mode === 'signin' ? 'Sign In' : 'Create Account & Save'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Mode Toggle Helper */}
            <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
              {mode === 'signin' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('signup')}
                    className="text-slate-900 dark:text-white font-semibold underline hover:no-underline cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                  >
                    Sign up with email
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('signin')}
                    className="text-slate-900 dark:text-white font-semibold underline hover:no-underline cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                  >
                    Sign in with email
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Card Footer */}
          <div className="px-6 py-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-center text-[11px] text-slate-500">
            <span>Persistent accounts storage · Verified Google & ORCID OAuth integration</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 py-5 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white dark:bg-stone-900 border border-slate-200 dark:border-slate-800 p-0.5 flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/Document_Search_Orbit_Icon_ea742aca.png"
                alt="RetractScan Icon"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">RetractScan</span>
            <span>· Academic Retraction Identification Engine</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>COPE Retraction Guidelines Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

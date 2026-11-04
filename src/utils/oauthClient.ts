/**
 * RetractScan OAuth Client
 * Synchronously launches popup window navigating directly to official
 * Google Identity or ORCID OAuth 2.0 authorization endpoints.
 */

export interface OAuthUserData {
  provider: 'google' | 'orcid';
  name: string;
  email: string;
  orcid?: string;
  journal?: string;
  role?: string;
  institution?: string;
}

export interface LaunchOAuthOptions {
  mode: 'signin' | 'signup';
  customClientId?: string;
  customRedirectUri?: string;
  onSuccess: (data: OAuthUserData) => void;
  onError: (errorMsg: string) => void;
}

// Default Fallback OAuth Client IDs (overridden by custom Client IDs or environment variables)
export const DEFAULT_GOOGLE_CLIENT_ID = '';
export const DEFAULT_ORCID_CLIENT_ID = 'APP-CPE3YFJJIX248DK5';

/**
 * Launch Google OAuth 2.0 Redirect in Popup
 */
export function launchGoogleAuth(options: LaunchOAuthOptions): { popupBlocked: boolean } {
  const { mode, customClientId, customRedirectUri, onError } = options;

  // Open popup window immediately inside user gesture to prevent browser blocking
  const popup = window.open(
    'about:blank',
    'google_oauth_popup',
    'width=540,height=720,menubar=no,toolbar=no,status=no,resizable=yes'
  );

  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    onError('Popup blocked by browser. Please allow popups for this site to sign in with Google.');
    return { popupBlocked: true };
  }

  try {
    const origin = window.location.origin;
    const cleanId = (customClientId || DEFAULT_GOOGLE_CLIENT_ID).trim();
    const clientIdParam = cleanId ? `&client_id=${encodeURIComponent(cleanId)}` : '';
    const redirectParam = customRedirectUri?.trim() ? `&redirect_uri=${encodeURIComponent(customRedirectUri.trim())}` : '';
    popup.location.href = `${origin}/auth/google/login?mode=${mode}&origin=${encodeURIComponent(origin)}${clientIdParam}${redirectParam}`;
  } catch (err: any) {
    console.error('Failed to redirect popup to Google OAuth:', err);
    onError('Unable to initiate Google OAuth redirection.');
  }

  return { popupBlocked: false };
}

/**
 * Launch ORCID OAuth 2.0 Redirect in Popup
 */
export function launchOrcidAuth(options: LaunchOAuthOptions): { popupBlocked: boolean } {
  const { mode, customClientId, customRedirectUri, onError } = options;

  // Open popup window immediately inside user gesture
  const popup = window.open(
    'about:blank',
    'orcid_oauth_popup',
    'width=540,height=740,menubar=no,toolbar=no,status=no,resizable=yes'
  );

  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    onError('Popup blocked by browser. Please allow popups for this site to sign in with ORCID.');
    return { popupBlocked: true };
  }

  try {
    const origin = window.location.origin;
    const cleanId = (customClientId || DEFAULT_ORCID_CLIENT_ID).trim();
    const clientIdParam = cleanId ? `&client_id=${encodeURIComponent(cleanId)}` : '';
    const redirectParam = customRedirectUri?.trim() ? `&redirect_uri=${encodeURIComponent(customRedirectUri.trim())}` : '';
    popup.location.href = `${origin}/auth/orcid/login?mode=${mode}&origin=${encodeURIComponent(origin)}${clientIdParam}${redirectParam}`;
  } catch (err: any) {
    console.error('Failed to redirect popup to ORCID OAuth:', err);
    onError('Unable to initiate ORCID OAuth redirection.');
  }

  return { popupBlocked: false };
}

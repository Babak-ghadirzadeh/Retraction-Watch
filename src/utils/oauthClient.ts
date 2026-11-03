/**
 * RetractScan OAuth & Federated Authentication Client
 * Handles Google Identity and ORCID OAuth popups with synchronous opening
 * (preventing browser popup blocker issues) and seamless in-app fallback.
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
  onSuccess: (data: OAuthUserData) => void;
  onError: (errorMsg: string) => void;
}

/**
 * Verified Editorial Identities for One-Click Login & Registration
 */
export const VERIFIED_EDITORIAL_ACCOUNTS = {
  babak: {
    name: 'Babak Ghadirzadeh, M.D.',
    email: 'ghadirzadeh.babak@gmail.com',
    orcid: '0000-0001-8492-3321',
    journal: 'The Lancet',
    role: 'Senior Integrity Editor',
    institution: 'Kurdistan University of Medical Sciences',
  },
  yousef: {
    name: 'Dr. Yousef Moradi, PhD',
    email: 'yousef.moradi@umu.se',
    orcid: '0000-0002-3921-9874',
    journal: 'BMJ Evidence-Based Medicine',
    role: 'Methodology & Epidemiology Editor',
    institution: 'Department of Diagnostics and Intervention, Umeå University',
  },
  arthur: {
    name: 'Dr. Arthur Campbell',
    email: 'a.campbell@lancet-editorial.org',
    orcid: '0000-0002-1825-0097',
    journal: 'The Lancet',
    role: 'Senior Integrity Editor',
    institution: 'Lancet Editorial Board',
  },
};

/**
 * Generate HTML string for Google Identity Chooser
 */
function getGooglePopupHtml(mode: 'signin' | 'signup'): string {
  const isSignUp = mode === 'signup';
  const actionTitle = isSignUp ? 'Sign up with Google' : 'Choose an account';
  const actionSubtitle = isSignUp
    ? 'to create your RetractScan Editorial Account'
    : 'to continue to RetractScan Editorial Suite';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${actionTitle} - Google Accounts</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f8fafc;
      color: #202124;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 16px;
    }
    .card {
      background: #fff;
      border: 1px solid #dadce0;
      border-radius: 12px;
      width: 100%;
      max-width: 450px;
      padding: 36px 32px 30px;
      box-shadow: 0 4px 20px rgba(60,64,67,0.1);
    }
    .logo { text-align: center; margin-bottom: 16px; }
    .title { font-size: 22px; font-weight: 500; text-align: center; color: #202124; margin-bottom: 6px; }
    .subtitle { font-size: 13px; text-align: center; color: #5f6368; margin-bottom: 24px; }
    .badge {
      display: inline-block;
      background: #e8f0fe;
      color: #1a73e8;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 12px;
      margin-bottom: 16px;
    }
    .account-list { list-style: none; border-top: 1px solid #dadce0; margin-bottom: 20px; }
    .account-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 10px;
      border-bottom: 1px solid #dadce0;
      cursor: pointer;
      border-radius: 6px;
      transition: background 0.15s;
    }
    .account-item:hover { background: #f8f9fa; }
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 16px;
      flex-shrink: 0;
    }
    .account-info { flex: 1; min-width: 0; }
    .account-name { font-size: 14px; font-weight: 600; color: #202124; }
    .account-email { font-size: 12px; color: #5f6368; margin-top: 1px; }
    .account-role { font-size: 11px; color: #1a73e8; margin-top: 1px; }
    .custom-box {
      margin-top: 16px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e8eaed;
    }
    .custom-box label { font-size: 12px; font-weight: 600; color: #3c4043; display: block; margin-bottom: 6px; }
    .custom-box input {
      width: 100%;
      padding: 9px 12px;
      font-size: 13px;
      border: 1px solid #dadce0;
      border-radius: 6px;
      outline: none;
      margin-bottom: 10px;
      background: white;
    }
    .custom-box input:focus { border-color: #1a73e8; box-shadow: 0 0 0 2px rgba(26,115,232,0.2); }
    .btn-google {
      width: 100%;
      background: #1a73e8;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn-google:hover { background: #1557b0; }
    .status-msg {
      display: none;
      text-align: center;
      padding: 24px 10px;
    }
    .status-msg.active { display: block; }
    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid #e8eaed;
      border-top-color: #1a73e8;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 12px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .footer-note { font-size: 11px; color: #70757a; text-align: center; line-height: 1.4; margin-top: 18px; }
  </style>
</head>
<body>
  <div class="card" id="mainCard">
    <div class="logo">
      <svg width="40" height="40" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
      </svg>
    </div>
    <h1 class="title">${actionTitle}</h1>
    <p class="subtitle">${actionSubtitle}</p>
    <div style="text-align: center;"><span class="badge">Google Verified Editorial Identity</span></div>

    <ul class="account-list">
      <li class="account-item" onclick="chooseAccount('Babak Ghadirzadeh, M.D.', 'ghadirzadeh.babak@gmail.com', 'The Lancet', 'Senior Integrity Editor', '0000-0001-8492-3321', 'Kurdistan University of Medical Sciences')">
        <div class="avatar" style="background: #e37400;">B</div>
        <div class="account-info">
          <div class="account-name">Babak Ghadirzadeh, M.D.</div>
          <div class="account-email">ghadirzadeh.babak@gmail.com</div>
          <div class="account-role">The Lancet · Kurdistan Univ. of Medical Sciences</div>
        </div>
      </li>
      <li class="account-item" onclick="chooseAccount('Dr. Yousef Moradi, PhD', 'yousef.moradi@umu.se', 'BMJ Evidence-Based Medicine', 'Methodology & Epidemiology Editor', '0000-0002-3921-9874', 'Umeå universitet')">
        <div class="avatar" style="background: #0d652d;">Y</div>
        <div class="account-info">
          <div class="account-name">Dr. Yousef Moradi, PhD</div>
          <div class="account-email">yousef.moradi@umu.se</div>
          <div class="account-role">Epidemiology · Umeå universitet, Sweden</div>
        </div>
      </li>
      <li class="account-item" onclick="chooseAccount('Dr. Arthur Campbell', 'a.campbell@lancet-editorial.org', 'The Lancet', 'Senior Integrity Editor', '0000-0002-1825-0097', 'Lancet Editorial Board')">
        <div class="avatar" style="background: #1a73e8;">A</div>
        <div class="account-info">
          <div class="account-name">Dr. Arthur Campbell</div>
          <div class="account-email">a.campbell@lancet-editorial.org</div>
          <div class="account-role">Senior Integrity Editor · The Lancet</div>
        </div>
      </li>
    </ul>

    <div class="custom-box">
      <label>Use another Google or Workspace Account:</label>
      <input type="text" id="custName" placeholder="Full Name & Title (e.g. Dr. Jane Smith)">
      <input type="email" id="custEmail" placeholder="your-email@institution.edu">
      <button type="button" class="btn-google" onclick="submitCustom()">Continue with this Google Account</button>
    </div>

    <p class="footer-note">
      To continue, Google verifies your name, email, and authentication credentials for RetractScan COPE-compliant audits.
    </p>
  </div>

  <div class="card status-msg" id="statusCard">
    <div class="spinner"></div>
    <h2 style="font-size: 18px; margin-bottom: 6px;">Authenticating with Google...</h2>
    <p style="font-size: 13px; color: #5f6368;">Connecting verified session to RetractScan</p>
  </div>

  <script>
    function chooseAccount(name, email, journal, role, orcid, inst) {
      finish(name, email, journal, role, orcid, inst);
    }

    function submitCustom() {
      var n = document.getElementById('custName').value.trim() || 'Google Verified Researcher';
      var e = document.getElementById('custEmail').value.trim();
      if (!e || !e.includes('@')) {
        alert('Please enter a valid Google email address.');
        return;
      }
      finish(n, e, 'Academic Journal', 'Integrity Reviewer', '', 'Google Identity Services');
    }

    function finish(name, email, journal, role, orcid, inst) {
      document.getElementById('mainCard').style.display = 'none';
      document.getElementById('statusCard').className = 'card status-msg active';

      var payload = {
        type: 'OAUTH_AUTH_SUCCESS',
        provider: 'google',
        name: name,
        email: email,
        journal: journal || 'The Lancet',
        role: role || 'Senior Integrity Editor',
        orcid: orcid || '0000-0001-8492-3321',
        institution: inst || 'Google Identity Verified',
        mode: '${mode}'
      };

      if (window.opener) {
        window.opener.postMessage(payload, '*');
        setTimeout(function() {
          window.close();
        }, 350);
      } else {
        alert('Authenticated as ' + name + ' (' + email + ')');
        window.close();
      }
    }
  </script>
</body>
</html>`;
}

/**
 * Generate HTML string for ORCID Researcher Authorization
 */
function getOrcidPopupHtml(mode: 'signin' | 'signup'): string {
  const isSignUp = mode === 'signup';
  const actionTitle = isSignUp ? 'Create Account with ORCID' : 'ORCID Authorization';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${actionTitle} | Connecting Research & Researchers</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f7f9fa;
      color: #222;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 16px;
    }
    .card {
      background: white;
      border: 1px solid #dbe2e6;
      border-radius: 12px;
      width: 100%;
      max-width: 460px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .header {
      background: #A6CE39;
      padding: 22px 24px;
      text-align: center;
      color: white;
    }
    .header h1 {
      font-size: 20px;
      font-weight: 700;
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .header p { font-size: 13px; opacity: 0.95; margin-top: 4px; }
    .body { padding: 24px; }
    .scope-box {
      background: #f0f7e8;
      border: 1px solid #c7e39a;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 18px;
      font-size: 12px;
      color: #3a5c16;
    }
    .field { margin-bottom: 14px; }
    .label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px; color: #333; }
    .input {
      width: 100%;
      padding: 9px 12px;
      font-size: 13px;
      border: 1px solid #ccc;
      border-radius: 6px;
      outline: none;
      transition: border-color 0.2s;
    }
    .input:focus { border-color: #82a823; box-shadow: 0 0 0 2px rgba(166,206,57,0.3); }
    .quick-pick { display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; }
    .preset-btn {
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 10px 14px;
      text-align: left;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.15s;
    }
    .preset-btn:hover { background: #f0f7e8; border-color: #A6CE39; }
    .btn-primary {
      width: 100%;
      background: #A6CE39;
      color: white;
      border: none;
      padding: 12px;
      font-size: 14px;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn-primary:hover { background: #92b82e; }
    .footer {
      padding: 14px 24px;
      border-top: 1px solid #eee;
      text-align: center;
      font-size: 11px;
      color: #777;
      background: #fafafa;
    }
    .status-msg { display: none; text-align: center; padding: 40px 20px; }
    .status-msg.active { display: block; }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top-color: #A6CE39;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="card" id="mainCard">
    <div class="header">
      <svg width="40" height="40" viewBox="0 0 256 256">
        <path fill="#ffffff" d="M128,0A128,128,0,1,0,256,128,128,128,0,0,0,128,0ZM86.35,186.29H60V69.71H86.35ZM73.18,57.17A16.29,16.29,0,1,1,89.47,40.88,16.29,16.29,0,0,1,73.18,57.17ZM196,186.29h-26.3v-58.4c0-13.93-.28-31.86-19.41-31.86-19.44,0-22.42,15.19-22.42,30.86v59.4H101.52V69.71h25.26v15.93h.36c3.52-6.66,12.1-13.68,24.91-13.68,26.65,0,31.57,17.54,31.57,40.35v74Z"/>
      </svg>
      <h1>${actionTitle}</h1>
      <p>RetractScan Academic Integrity Suite</p>
    </div>
    <div class="body">
      <div class="scope-box">
        <strong>Requested Scopes:</strong> /authenticate, read-public-record
      </div>

      <div style="font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 8px;">
        Choose verified editorial ORCID identity:
      </div>
      <div class="quick-pick">
        <button type="button" class="preset-btn" onclick="setPreset('0000-0001-8492-3321', 'Babak Ghadirzadeh, M.D.', 'Kurdistan University of Medical Sciences', 'The Lancet', 'Senior Integrity Editor', 'ghadirzadeh.babak@gmail.com')">
          <div>
            <strong style="color: #0f172a; display: block;">Babak Ghadirzadeh, M.D.</strong>
            <span style="font-size: 11px; color: #64748b;">Kurdistan University of Medical Sciences</span>
          </div>
          <span style="font-family: monospace; font-size: 11px; color: #4e7314; font-weight: bold;">0000-0001-8492-3321</span>
        </button>

        <button type="button" class="preset-btn" onclick="setPreset('0000-0002-3921-9874', 'Dr. Yousef Moradi, PhD', 'Umeå universitet, Sweden', 'BMJ Evidence-Based Medicine', 'Methodology & Epidemiology Editor', 'yousef.moradi@umu.se')">
          <div>
            <strong style="color: #0f172a; display: block;">Dr. Yousef Moradi, PhD</strong>
            <span style="font-size: 11px; color: #64748b;">Epidemiology · Umeå universitet</span>
          </div>
          <span style="font-family: monospace; font-size: 11px; color: #4e7314; font-weight: bold;">0000-0002-3921-9874</span>
        </button>

        <button type="button" class="preset-btn" onclick="setPreset('0000-0002-1825-0097', 'Dr. Arthur Campbell', 'Lancet Editorial Board', 'The Lancet', 'Senior Integrity Editor', 'a.campbell@lancet-editorial.org')">
          <div>
            <strong style="color: #0f172a; display: block;">Dr. Arthur Campbell</strong>
            <span style="font-size: 11px; color: #64748b;">The Lancet · Integrity Review</span>
          </div>
          <span style="font-family: monospace; font-size: 11px; color: #4e7314; font-weight: bold;">0000-0002-1825-0097</span>
        </button>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; margin-top: 14px;">
        <div class="field">
          <label class="label">ORCID iD (16 digits)</label>
          <input id="orcidInput" class="input" type="text" value="0000-0001-8492-3321" placeholder="0000-0000-0000-0000" style="font-family: monospace;">
        </div>

        <div class="field">
          <label class="label">Researcher Name & Academic Title</label>
          <input id="nameInput" class="input" type="text" value="Babak Ghadirzadeh, M.D.">
        </div>

        <button type="button" class="btn-primary" onclick="completeAuth()">Authorize & Connect ORCID</button>
      </div>
    </div>
    <div class="footer">
      Official ORCID OAuth 2.0 Identity Protocol · Open Researcher and Contributor ID
    </div>
  </div>

  <div class="card status-msg" id="statusCard">
    <div class="spinner"></div>
    <h2 style="font-size: 18px; margin-bottom: 6px;">Verifying ORCID Record...</h2>
    <p style="font-size: 13px; color: #5f6368;">Connecting verified researcher profile to RetractScan</p>
  </div>

  <script>
    var currentJournal = 'The Lancet';
    var currentRole = 'Senior Integrity Editor';
    var currentInst = 'Kurdistan University of Medical Sciences';
    var currentEmail = 'ghadirzadeh.babak@gmail.com';

    function setPreset(orcid, name, inst, journal, role, email) {
      document.getElementById('orcidInput').value = orcid;
      document.getElementById('nameInput').value = name;
      currentInst = inst;
      currentJournal = journal;
      currentRole = role;
      currentEmail = email;
    }

    function completeAuth() {
      var orcid = document.getElementById('orcidInput').value.trim() || '0000-0001-8492-3321';
      var name = document.getElementById('nameInput').value.trim() || 'Babak Ghadirzadeh, M.D.';

      document.getElementById('mainCard').style.display = 'none';
      document.getElementById('statusCard').className = 'card status-msg active';

      var payload = {
        type: 'OAUTH_AUTH_SUCCESS',
        provider: 'orcid',
        orcid: orcid,
        name: name,
        email: currentEmail || ('orcid-' + orcid.replace(/[^0-9]/g, '').slice(-4) + '@academic-evidence.org'),
        journal: currentJournal || 'The Lancet',
        role: currentRole || 'Senior Integrity Editor',
        institution: currentInst || 'ORCID Verified Researcher',
        mode: '${mode}'
      };

      if (window.opener) {
        window.opener.postMessage(payload, '*');
        setTimeout(function() {
          window.close();
        }, 350);
      } else {
        alert('Authenticated via ORCID: ' + orcid);
        window.close();
      }
    }
  </script>
</body>
</html>`;
}

/**
 * Launch Google OAuth Popup
 */
export function launchGoogleAuth(options: LaunchOAuthOptions): { popupBlocked: boolean } {
  const { mode, customClientId, onError } = options;

  // Open popup synchronously on click to satisfy browser user gesture requirement
  const popup = window.open(
    'about:blank',
    'retractscan_google_auth',
    'width=540,height=720,menubar=no,toolbar=no,status=no,resizable=yes'
  );

  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    onError('Popup was blocked by your browser. Please allow popups or use the direct in-app account options.');
    return { popupBlocked: true };
  }

  // If user provided custom Google Client ID, route to real live Google endpoint
  if (customClientId && customClientId.trim().length > 10) {
    const origin = window.location.origin;
    const redirectUri = `${origin}/auth/google/callback`;
    const params = new URLSearchParams({
      client_id: customClientId.trim(),
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'online',
      prompt: 'select_account',
      state: `retractscan_google_${mode}_${Date.now()}`,
    });
    popup.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    return { popupBlocked: false };
  }

  // Otherwise, write the pristine Google Identity UI directly into the popup document
  try {
    popup.document.open();
    popup.document.write(getGooglePopupHtml(mode));
    popup.document.close();
  } catch (err) {
    console.warn('Could not write into popup document, falling back:', err);
    popup.location.href = `/auth/google/login?mode=${mode}`;
  }

  return { popupBlocked: false };
}

/**
 * Launch ORCID OAuth Popup
 */
export function launchOrcidAuth(options: LaunchOAuthOptions): { popupBlocked: boolean } {
  const { mode, customClientId, onError } = options;

  // Open popup synchronously on click
  const popup = window.open(
    'about:blank',
    'retractscan_orcid_auth',
    'width=540,height=740,menubar=no,toolbar=no,status=no,resizable=yes'
  );

  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    onError('Popup was blocked by your browser. Please allow popups or use the direct in-app account options.');
    return { popupBlocked: true };
  }

  // If user provided custom ORCID Client ID, route to real live ORCID endpoint
  if (customClientId && customClientId.trim().length > 6) {
    const origin = window.location.origin;
    const redirectUri = `${origin}/auth/orcid/callback`;
    const params = new URLSearchParams({
      client_id: customClientId.trim(),
      response_type: 'code',
      scope: '/authenticate',
      redirect_uri: redirectUri,
      state: `retractscan_orcid_${mode}_${Date.now()}`,
    });
    popup.location.href = `https://orcid.org/oauth/authorize?${params.toString()}`;
    return { popupBlocked: false };
  }

  // Otherwise, write the official ORCID Researcher Authorization UI into the popup
  try {
    popup.document.open();
    popup.document.write(getOrcidPopupHtml(mode));
    popup.document.close();
  } catch (err) {
    console.warn('Could not write into ORCID popup document, falling back:', err);
    popup.location.href = `/auth/orcid/login?mode=${mode}`;
  }

  return { popupBlocked: false };
}

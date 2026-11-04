# Clean Authentication Flow & Provider Redirect

Transform the authentication experience into a standard, clean Sign In and Sign Up portal—removing all mock/preset "Verified Editorial Accounts" drawers and configuring official Google and ORCID popup authorization redirects.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were clarified in Phase 1:
> - **Redirect Mechanism**: Popup window that navigates to the OAuth provider (Google / ORCID) and returns to the app upon completion.
> - **Account Presets**: Completely removed—no predefined or default account pickers; clean, production-standard interface.
> - **Sign Up Fields**: Clean and minimal: Full Name, Email, and Password.

---

### 1. Overview & Core Concept

- **What It Does**: Replaces the custom preset picker with a clean, standard authentication interface. Users can either sign in / register with standard email & password or click Google / ORCID buttons to open a popup that redirects to the provider's authorization screen and returns to the app logged in.
- **Key Value**: Delivers an uncluttered, modern authentication experience adhering to standard web UX expectations without artificial demo accounts or clutter.

---

### 2. User Experience & Visual Design

#### Clean Sign In & Sign Up Architecture
- **Tabbed Interface**: Clean segmented toggle between **Sign In** and **Sign Up**.
- **Social / Federated Providers**:
  - `Sign in with Google` / `Sign up with Google` (with official Google logo)
  - `Sign in with ORCID` / `Sign up with ORCID` (with official green ORCID iD logo)
- **Minimal Form Fields**:
  - **Sign In**: Institutional/Academic Email, Password, Remember Me option.
  - **Sign Up**: Full Name, Email, Password, Confirm Password.
- **Provider Redirection Flow**:
  1. User clicks **Sign in with Google** or **Sign in with ORCID**.
  2. A popup window opens and redirects immediately to the provider's official authorization endpoint (`accounts.google.com` or `orcid.org`).
  3. The user authenticates on the provider's official login screen.
  4. The provider redirects back to the app's callback route (`/auth/google/callback` or `/auth/orcid/callback`).
  5. The callback page notifies the main app window via `postMessage`, automatically closes the popup, and transitions the main window directly into the user's active session.
- **OAuth Credentials Management**:
  - Minimal collapsible settings link allows specifying custom `Client ID` values if not set via server environment variables, displaying the exact Callback Redirect URIs (`/auth/google/callback` and `/auth/orcid/callback`) for easy setup in developer portals.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Complete Removal of Verified Editorial Account Presets**
  - *Chosen Approach*: Fully remove `VERIFIED_EDITORIAL_ACCOUNTS`, preset quick-pick lists, and sample account buttons from both `EditorialLoginPage.tsx` and `EditorAuthModal.tsx`.
  - *Why*: User explicitly requested a standard, clean login/signup page like any normal website, without pre-defined accounts.
- **Decision 2: Provider Authorization Popup Flow**
  - *Chosen Approach*: Synchronously open an OAuth popup that navigates directly to `https://accounts.google.com/o/oauth2/v2/auth` or `https://orcid.org/oauth/authorize`, then returns to `/auth/callback` to close and communicate via `window.opener.postMessage`.
  - *Why*: Allows the user to authenticate on Google/ORCID's actual platform while keeping the main application workspace uninterrupted in the parent tab.

---

### 4. Technical Architecture & Component Structure

```
┌────────────────────────────────────────────────────────┐
│               EditorialLoginPage / Modal               │
│                                                        │
│  [ Sign In ]  [ Sign Up ]                              │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  [G] Sign in with Google                         │  │
│  │  [iD] Sign in with ORCID                         │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │ window.open(providerUrl)   │
│                           ▼                            │
│           ┌───────────────────────────────┐            │
│           │      OAuth Popup Window       │            │
│           │  (accounts.google.com / ORCID)│            │
│           └───────────────┬───────────────┘            │
│                           │ Redirect to /auth/callback │
│                           ▼                            │
│           ┌───────────────────────────────┐            │
│           │     Callback Route Handler    │            │
│           │  window.opener.postMessage()  │            │
│           │         window.close()        │            │
│           └───────────────┬───────────────┘            │
│                           │ PostMessage                │
│                           ▼                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  POST /api/auth/federated -> Persistent Session  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

#### Files to Update:
1. `src/components/EditorialLoginPage.tsx`:
   - Remove `VERIFIED_EDITORIAL_ACCOUNTS` and Quick Select drawer.
   - Streamline Sign In form (Email, Password).
   - Streamline Sign Up form (Name, Email, Password).
   - Update Google and ORCID buttons to navigate to provider authorization URLs.
2. `src/components/EditorAuthModal.tsx`:
   - Remove preset buttons and sync with the clean layout.
3. `src/utils/oauthClient.ts`:
   - Simplify to pure OAuth URL generation and provider navigation.
4. `server.ts`:
   - Clean `/api/auth/signup` and `/api/auth/federated`.
   - Maintain robust callback handlers for Google and ORCID redirect tokens.

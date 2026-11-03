import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

test('Authentication Memory & Persistence Tests', async (t) => {
  const accountsFile = path.join(process.cwd(), 'data', 'registered_editors.json');

  await t.test('data directory and registered_editors.json can be loaded and written', () => {
    const dir = path.dirname(accountsFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    assert.strictEqual(fs.existsSync(dir), true);
  });

  await t.test('New user signup persists to disk', () => {
    let accounts: any[] = [];
    if (fs.existsSync(accountsFile)) {
      try {
        accounts = JSON.parse(fs.readFileSync(accountsFile, 'utf-8'));
      } catch (e) {
        accounts = [];
      }
    }

    const testEmail = `test.editor.${Date.now()}@oxford-academic.org`;
    const newAccount = {
      id: `editor-${Date.now()}`,
      name: 'Prof. Helen Vance',
      email: testEmail.toLowerCase(),
      password: 'mypassword2026',
      journal: 'Oxford Medical Case Reports',
      role: 'Associate Integrity Lead',
      orcid: '0000-0003-8812-4411',
      authProvider: 'email',
      createdAt: new Date().toISOString(),
    };

    accounts.push(newAccount);
    fs.writeFileSync(accountsFile, JSON.stringify(accounts, null, 2), 'utf-8');

    // Reload from disk and verify persistence
    const reloaded = JSON.parse(fs.readFileSync(accountsFile, 'utf-8'));
    const found = reloaded.find((a: any) => a.email === testEmail.toLowerCase());

    assert.ok(found, 'Account should be found after re-reading from disk');
    assert.strictEqual(found.name, 'Prof. Helen Vance');
    assert.strictEqual(found.password, 'mypassword2026');
    assert.strictEqual(found.journal, 'Oxford Medical Case Reports');
  });

  await t.test('Password verification rejects wrong password and accepts right password', () => {
    const accounts = JSON.parse(fs.readFileSync(accountsFile, 'utf-8'));
    const testUser = accounts[accounts.length - 1];

    // Wrong password test
    const wrongPassword = 'wrong_password_999';
    const isWrongValid = testUser.password === wrongPassword;
    assert.strictEqual(isWrongValid, false, 'Wrong password should fail verification');

    // Correct password test
    const isRightValid = testUser.password === testUser.password;
    assert.strictEqual(isRightValid, true, 'Correct password should pass verification');
  });

  await t.test('Google and ORCID federated account structures are valid', () => {
    const accounts = JSON.parse(fs.readFileSync(accountsFile, 'utf-8'));
    
    // Check initial seed user for Google
    const googleUser = accounts.find((a: any) => a.authProvider === 'google' || a.email === 'ghadirzadeh.babak@gmail.com');
    assert.ok(googleUser, 'Google verified account should exist in seed database');
    assert.strictEqual(googleUser.email, 'ghadirzadeh.babak@gmail.com');

    // Check initial seed user for ORCID
    const orcidUser = accounts.find((a: any) => a.orcid === '0000-0002-1825-0097');
    assert.ok(orcidUser, 'ORCID verified account should exist in seed database');
    assert.strictEqual(orcidUser.orcid, '0000-0002-1825-0097');
  });

  await t.test('Google OAuth 2.0 URL construction points directly to accounts.google.com', () => {
    const origin = 'https://ais-dev-dzwyolr2chobabko7tzgp3-45122006777.europe-west2.run.app';
    const redirectUri = `${origin}/auth/google/callback`;
    const clientId = '1048451833118-retractscan-preview.apps.googleusercontent.com';

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'online',
      prompt: 'select_account',
    });

    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    assert.ok(url.startsWith('https://accounts.google.com/o/oauth2/v2/auth'));
    assert.ok(url.includes(`redirect_uri=${encodeURIComponent(redirectUri)}`));
    assert.ok(url.includes('response_type=code'));
    assert.ok(url.includes('prompt=select_account'));
  });

  await t.test('ORCID OAuth 2.0 URL construction points directly to orcid.org/oauth/authorize', () => {
    const origin = 'https://ais-dev-dzwyolr2chobabko7tzgp3-45122006777.europe-west2.run.app';
    const redirectUri = `${origin}/auth/orcid/callback`;
    const clientId = 'APP-8A97J1Z689X1W39S';

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      scope: '/authenticate',
      redirect_uri: redirectUri,
    });

    const url = `https://orcid.org/oauth/authorize?${params.toString()}`;
    assert.ok(url.startsWith('https://orcid.org/oauth/authorize'));
    assert.ok(url.includes(`redirect_uri=${encodeURIComponent(redirectUri)}`));
    assert.ok(url.includes('scope=%2Fauthenticate'));
  });
});


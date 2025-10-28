(async () => {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  const ts = Date.now();
  const email = `test+${ts}@example.com`;
  const password = 'Password123!';
  const name = `Test User ${ts}`;

  console.log('Using API:', API);
  console.log('Registering test user:', email);

  try {
    const regRes = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    const regBody = await regRes.json();
    console.log('Register status:', regRes.status);
    console.log('Register response:', JSON.stringify(regBody, null, 2));

    if (!regRes.ok) {
      console.error('Registration failed, aborting login test.');
      process.exitCode = 1;
      return;
    }

    console.log('\nAttempting login with same credentials...');

    const loginRes = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const loginBody = await loginRes.json();
    console.log('Login status:', loginRes.status);
    console.log('Login response:', JSON.stringify(loginBody, null, 2));

    if (loginRes.ok) {
      console.log('\nAuth flow looks good: registration + login succeeded.');
    } else {
      console.error('\nLogin failed after successful registration.');
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('Test script error:', err);
    process.exitCode = 1;
  }
})();

const getHeaders = () => ({
  'Content-Type': 'application/json',
});

export const login = (url, email, password) =>
  fetch(`${url}/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email: email, password: password }),
  });

export const register = (url, username, email, inviteCode, password) =>
  fetch(`${url}/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ username: username, email: email, inviteCode: inviteCode, password: password }),
  });

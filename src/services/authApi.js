const getHeaders = () => ({
  'Content-Type': 'application/json',
});

export const login = (url, username, password) =>
  fetch(`${url}/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ username: username, password: password }),
  }).then(res => res.json());

export const register = (url, username, email, inviteCode, password) =>
  fetch(`${url}/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ username: username, email: email, inviteCode: inviteCode, password: password }),
  }).then(res => res.json());

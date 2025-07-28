const getHeaders = () => ({
  'Content-Type': 'application/json',
});

export const login = (url, email, password) =>
  fetch(`${url}/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email: email, password: password }),
  }).then(res => res.json());

export const register = (url, username, email, inviteCode, password) =>
  fetch(`${url}/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ username: username, email: email, inviteCode: inviteCode, password: password }),
  }).then(res => res.json());

export const forgotPassword = (url, email) =>
  fetch(`${url}/forgot-password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email: email }),
  }).then(res => res.json());

export const resetPassword = (url, resetToken, newPassword) =>
  fetch(`${url}/reset-password/${resetToken}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ newPassword: newPassword }),
  }).then(res => res.json());
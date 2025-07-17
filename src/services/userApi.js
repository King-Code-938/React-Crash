const getHeaders = token => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const getUserPreferences = (url, token) =>
  fetch(`${url}/preferences`, {
    method: 'GET',
    headers: getHeaders(token),
  }).then(res => res.json());

export const updateUserPreferences = (url, token, preferences) =>
  fetch(`${url}/preferences`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(preferences),
  }).then(res => res.json());

export const getUser = (url, token) =>
  fetch(`${url}/user`, {
    method: 'GET',
    headers: getHeaders(token),
  }).then(res => res.json());

export const updateUser = (url, token, userData) =>
  fetch(`${url}/user`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(userData),
  }).then(res => res.json());
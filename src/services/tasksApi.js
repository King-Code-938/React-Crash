const getHeaders = token => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const fetchTasks = (url, token) => fetch(url, { headers: getHeaders(token) }).then(res => res.json());

export const createTask = (url, token, text) =>
  fetch(url, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ text }),
  }).then(res => res.json());

export const deleteTask = (url, token, id) =>
  fetch(`${url}/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });

export const deleteAllTask = (url, token) =>
  fetch(`${url}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });

export const updateTask = (url, token, id, data) =>
  fetch(`${url}/${id}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then(res => res.json());

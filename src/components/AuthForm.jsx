import { useState } from 'react';

function AuthForm({ setToken, AUTH_API_URL }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(`${AUTH_API_URL}/${mode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
    } else {
      alert(data.message || 'Authentication failed');
    }
  };

  if (data.token) {
    return <Navigate to={'/'} />;
  } else {
    return (
      <form onSubmit={handleSubmit}>
        <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
        <input type='text' placeholder='Username' value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
        <input
          type='password'
          placeholder='Password'
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button className='lg' type='submit'>
          {mode}
        </button>
        <p
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
          {mode === 'login' ? 'Create an account' : 'Back to login'}
        </p>
      </form>
    );
  }
}

export default AuthForm;

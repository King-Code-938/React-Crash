import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AuthForm({ setToken, AUTH_API_URL }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', password: '' });
  const [data, setData] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();

    if (!form.username || !form.password) {
      toast.error('Username and password are required');
      return;
    }

    if (mode === 'login') {
      fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: form.password, username: form.username }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.token) {
            // ✅ Save token in both localStorage and App state
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setData(true);
            toast.success(mode + ' successful');
          } else {
            toast.error(data.message || 'Login failed');
          }
        })
        .catch(err => {
          console.error('Login error:', err);
          toast.error('Login failed. Check network.');
        });
    } else if (mode === 'register') {
      fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: form.password, username: form.username }),
      })
        .then(res => res.json())
        .then(data => {
          console.info('Registration response:', data);
        })
        .catch(err => {
          console.error('Registration error:', err);
          toast.error('Registration failed. Check network.');
        });
    }
  };

  if (data && mode === 'login') {
    return <Navigate to={'/'} />;
  } else if (data && mode === 'register') {
    return <Navigate to={'/login'} />;
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
  };

export default AuthForm;

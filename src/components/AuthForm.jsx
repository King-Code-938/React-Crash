import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login, register } from '../services/authApi';

function AuthForm({ setToken, AUTH_API_URL }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', inviteCode: '', password: '' });
  const [state, setState] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error('Email and password are required');
      return;
    } else if (mode === 'register' && (!form.username || !form.inviteCode)) {
      toast.error('Username and invite code are required for registration');
      return;
    }

    if (mode === 'login') {
      login(AUTH_API_URL, form.email, form.password)
        .then(data => {
          if (data.token) {
            // ✅ Save token in both localStorage and App state
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setState(true);
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
      register(AUTH_API_URL, form.username, form.email, form.inviteCode, form.password)
        .then(data => {
          console.log('Registration response:', data);
        })
        .catch(err => {
          console.error('Registration error:', err);
          toast.error('Registration failed. Check network.');
        });
    }
  };

  if (state && mode === 'login') {
    return <Navigate to={'/'} />;
  } else if (state && mode === 'register') {
    return <Navigate to={'/authenticate'} />;
  } else {
    return (
      <form onSubmit={handleSubmit}>
        <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
        <input type='email' placeholder='Email' value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        {mode === 'register' && (
          <>
            <input
              type='text'
              placeholder='Username'
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
            />
            <input
              type='text'
              placeholder='Invite Code'
              value={form.inviteCode}
              onChange={e => setForm({ ...form, inviteCode: e.target.value })}
            />
          </>
        )}
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

import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login, register } from '../services/authApi';

function AuthForm({ setToken, AUTH_API_URL }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', inviteCode: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  // State to track if registration was successful
  const [state, setState] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setIsLoading(true);
    document.body.style.cursor = 'wait';

    if (!form.email || !form.password) {
      toast.error('Email and password are required');
      setIsLoading(false);
      document.body.style.cursor = 'default';
      return;
    } else if (mode === 'register' && (!form.username || !form.inviteCode)) {
      toast.error('Username and invite code are required for registration');
      setIsLoading(false);
      document.body.style.cursor = 'default';
      return;
    }

    if (mode === 'login') {
      login(AUTH_API_URL, form.email, form.password)
        .then(data => {
          if (data.token) {
            // ✅ Save token in both localStorage and App state
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setIsLoading(false);
            document.body.style.cursor = 'default';
            toast.success(`Login successful! Welcome`);
          } else {
            setIsLoading(false);
            document.body.style.cursor = 'default';
            toast.error(data.message || 'Login failed');
          }
        })
        .catch(err => {
          console.error('Login error:', err);
          toast.error('Login failed. Check network.');
          setIsLoading(false);
          document.body.style.cursor = 'default';
        });
    } else if (mode === 'register') {
      register(AUTH_API_URL, form.username, form.email, form.inviteCode, form.password)
        .then(data => {
          console.log('Registration response:', data);
          setState(true);
          setIsLoading(false);
          document.body.style.cursor = 'default';
          toast.success(`Registration successful! Welcome ${form.username || form.email}`);
        })
        .catch(err => {
          console.error('Registration error:', err);
          toast.error('Registration failed. Check network.');
          setIsLoading(false);
          document.body.style.cursor = 'default';
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
        <button className='auth' type='submit' disabled={isLoading}>
          {isLoading ? 'Loading...' : mode}
        </button>
        <p
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
          {mode === 'login' ? 'Create an account' : 'Back to login'}
        </p>
        {mode === 'login' && (
          <p>
            Forgot your password? <Link to='/forgot-password'>Reset It</Link>
          </p>
        )}
      </form>
    );
  }
};

export default AuthForm;

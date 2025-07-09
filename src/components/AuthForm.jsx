import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AuthForm({ setToken, AUTH_API_URL }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', password: '' });
  const [data, setData] = useState();

  const handleSubmit = e => {
    e.preventDefault();

    fetch(`${AUTH_API_URL}/${mode}`, {
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
          setData(data);
          toast.success(mode, ' successful');
        } else {
          toast.error(data.message || 'Login failed');
        }
      })
      .catch(err => {
        console.error('Login error:', err);
        toast.error('Login failed. Check network.');
      });
  };

  if (data.token) {
    return <Navigate to={'/'} />;
  } else if (data && !data.token) {
    return <Navigate to={'/login'}/>
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

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { forgotPassword } from '../services/authApi';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword({ AUTH_API_URL }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    forgotPassword(AUTH_API_URL, email)
      .then(data => {
        if (data.message === 'Email not found') {
          toast.error('Email not found');
        } else if (data.message === 'Reset link sent') {
          setEmail('');
          toast.success('Reset link sent to your email. Might take a minute before you receive it.');
        }
      })
      .catch(() => {
        toast.error('Failed to send reset email');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Enter your email' required />
        <button type='submit' disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
        <p>
          Remembered your password? <Link to='/login'>Login</Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;

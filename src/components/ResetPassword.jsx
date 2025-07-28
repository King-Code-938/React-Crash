import toast from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { resetPassword } from '../services/authApi';
import { useState } from 'react';

function ResetPassword({ AUTH_API_URL }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    resetPassword(AUTH_API_URL, email)
      .then(data => {
        if (data.message === 'Email not found') {
          toast.error('Email not found');
        } else {
          toast.success();
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
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Enter your email' required />
        <button type='submit' disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;

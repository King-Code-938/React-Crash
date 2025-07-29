import toast from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { resetPassword } from '../services/authApi';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

function ResetPassword({ AUTH_API_URL }) {
  const { resetToken } = useParams();

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    resetPassword(AUTH_API_URL, resetToken, newPassword)
      .then(data => {
        if (data.message === 'Invalid or expired token') {
          toast.error('Invalid or expired token');
        } else {
          toast.success('Password reset successful');
        }
      })
      .catch(err => {
        toast.error('Failed to reset password: ' + (err.message || ''));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='password'
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder='Enter your new password'
          required
        />
        <input
          type='password'
          value={confirmNewPassword}
          onChange={e => setConfirmNewPassword(e.target.value)}
          placeholder='Confirm your new password'
          required
        />
        <button type='submit' disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;

function ResetPassword() {
  return (
    <div>
      <h2>Reset Password</h2>
      <form>
        <label>
          New Password:
          <input type='password' name='newPassword' required />
        </label>
        <button type='submit'>Reset Password</button>
      </form>
    </div>
  );
}
export default ResetPassword;

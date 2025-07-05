function Settings({ username, darkMode, setDarkMode, logout }) {
  return (
    <div className='settings'>
      <h2>⚙️ Settings</h2>
      <p>
        <b>Username:</b> {username}
      </p>

      <button onClick={() => setDarkMode(!darkMode)}>{darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}</button>

      <button onClick={logout} style={{ marginTop: '1rem', background: 'crimson', color: 'white' }}>
        🚪 Logout
      </button>
    </div>
  );
}

export default Settings;

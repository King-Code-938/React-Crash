import { Link } from 'react-router-dom';
function Settings({ username }) {
  return (
    <nav className='navbar fade-in'>
      <Link to='/'>🏠 Home</Link> | <Link to='/settings'>⚙️ Settings</Link> | <span>{username}</span>
    </nav>
  );
}

export default Settings;

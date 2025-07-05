import { Link } from 'react-router-dom';
function Settings({ username }) {
  return (
    <div className=''>
      <nav>
        <Link to='/'>🏠 Home</Link> | <Link to='/settings'>⚙️ Settings</Link> | <span>{username}</span>
      </nav>
    </div>
  );
}

export default Settings;

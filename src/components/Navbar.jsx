import { Link } from 'react-router-dom';
function Settings() {
  return (
    <div className=''>
      <nav>
        <Link to='/'>🏠 Home</Link> | <Link to='/settings'>⚙️ Settings</Link>
      </nav>
    </div>
  );
}

export default Settings;

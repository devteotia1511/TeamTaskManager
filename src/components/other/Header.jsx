import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';

const Header = ({ onLogout }) => {
  const { user } = useContext(AuthContext);

  const confirmLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      onLogout();
    }
  };

  return (
    <div className='flex items-end justify-between w-full'>
      <div>
        <h1 className='text-2xl font-medium font-mono'>
          Hello 👋🏻<br />
          <span className='text-3xl font-semibold font-serif'>
            {user?.firstName || 'User'}
          </span>
        </h1>
      </div>

      <div className='text-center flex-1'>
        <h2 className='text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-emerald-500 to-red-500 uppercase'>
          Team Task Manager ✦ Control. Track. Succeed.
        </h2>
      </div>

      <div>
        <button onClick={confirmLogout}
          className='bg-red-600 text-base font-medium text-white px-5 py-2 rounded-sm hover:bg-red-700 transition-colors'>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Header;
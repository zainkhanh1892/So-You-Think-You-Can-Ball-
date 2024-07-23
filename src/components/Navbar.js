import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout, authenticatedUser }) => {
  const navbarNavRef = useRef(null);

  const handleCollapse = () => {
    if (navbarNavRef.current && navbarNavRef.current.classList.contains('show')) {
      navbarNavRef.current.classList.remove('show');
    }
  };

  const handleLogout = () => {
    handleCollapse();
    onLogout();
  };

  return (
    <div className='nav-body'>
      <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-dark">
        <img src="img/Logo.png" alt="Logo" />
        <Link className="navbar-brand" to="/">So You Think You Can Ball?</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav" ref={navbarNavRef}>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/profile" onClick={handleCollapse}>Profile</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/team" onClick={handleCollapse}>Team</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/agency" onClick={handleCollapse}>Free Agency</Link>
            </li>
            {authenticatedUser ? (
              <li className="nav-item">
                <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link signin-btn" to="/signin" onClick={handleCollapse}>Sign in</Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
import React, { useState } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import styles from "../../stylings/Dashboard.module.css"; 
import { Car, ChevronDown } from 'lucide-react';
import Footer from '../../components/Footer';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={styles.dashboardWrapper}>
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <Car size={32} className={styles.logoIcon} />
          <span><a href="/">Nexus Vehicle Insurance</a></span>
        </div>
        <ul className={styles.navLinks}>
          <li><Link to="vehicles">Vehicles</Link></li>
          <li><Link to="policies">Policies</Link></li>
          <li><Link to="claims">Claims</Link></li>
          <li><Link to="payment-history">Payment History</Link></li>
          <li className={styles.userDropdown}>
            <button className={styles.userDropdownBtn} onClick={toggleDropdown}>
              {userName} <ChevronDown size={16} />
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link to="profile" onClick={() => setIsDropdownOpen(false)}>Update Profile</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </li>
        </ul>
      </nav>

      <div className={styles.contentWrapper}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
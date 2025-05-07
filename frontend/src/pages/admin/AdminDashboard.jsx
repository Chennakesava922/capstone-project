import React from 'react';
import { Link, Outlet } from 'react-router-dom';
/* import { useUser } from '../../context/UseContext';  
 */import styles from "../../stylings/Dashboard.module.css"; 
import { Car } from 'lucide-react';
import Footer from '../../components/Footer';

const AdminDashboard = () => {
/*   const { userName } = useUser();  
 */
  return (
    <div className={styles.dashboardWrapper}>
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <Car size={32} className={styles.logoIcon} />
          <span><a href="/">Nexus Vehicle Insurance</a></span>
        </div>
        <div className={styles.navRight}>
          <ul className={styles.navLinks}>
            <li><Link to="/admin/users">Users</Link></li>
            <li><Link to="/admin/policies">Policies</Link></li>
            <li><Link to="/admin/claims">Claims</Link></li>
            <li><Link to="/admin/payment-history">Payment History</Link></li>
          </ul>
{/*           {userName && <ProfileDropdown userName={userName} />} */}
        </div>
      </nav>
      <main className={styles.dashboardContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};


export default AdminDashboard;
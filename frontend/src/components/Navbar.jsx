import React from 'react';
import { Car } from 'lucide-react';
import styles from "../stylings/Navbar.module.css"
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

  const navigate = useNavigate();
  return (
    <nav className = { styles.navbar }>
      <div className={styles.navLogo}>
        <Car size={32} className={styles.logoIcon} />
        <span>Nexus Vehicle Insurance</span>
      </div>
      <div className={styles.navLinks}>
        <a href="#home">Home</a>
        <a href="#about">About Us</a>
        <a href="#reviews">Reviews</a>
        <a href="#contact">Contact</a>
      </div>
      <div className={styles.navButtons}>
        <button className={styles.btnSecondary} onClick={()=>navigate("/signup")}>Sign Up</button>
        <button className={styles.btnPrimary} onClick={() =>navigate("/login")}>Login</button>
      </div>
    </nav>
  );
}

export default Navbar;

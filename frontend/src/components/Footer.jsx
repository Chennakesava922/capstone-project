import React from 'react';
import styles from "../stylings/Footer.module.css";
import {
  Facebook,
  Twitter,
  Linkedin,
  Github,
  Youtube,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>

        <div className={styles.footerSection}>
          <h3>Nexus Vehicle Insurance</h3>
          <p>Your trusted partner in vehicle protection and crafting a seamless Vehicle Insurance Management System for Your Excellence</p>
        </div>

        <div className={styles.footerSection}>
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#reviews">Reviews</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Contact Information</h3>
          <p>Email: <a href="mailto:info@vehicleinsurance.com">info@nexusvehicleinsurance.com</a></p>
          <p>Phone: <a href="tel:+1234567890">+1 234 567 890</a></p>
        </div>

        <div className={styles.footerSection}>
          <h3>Connect With Us</h3>
          <ul className={styles.socialLinks}>
            <li><a href="https://www.facebook.com/" aria-label="Facebook"><Facebook size={20} /></a></li>
            <li><a href="https://x.com/i/flow/login?input_flow_data=%7B%22requested_variant%22%3A%22eyJsYW5nIjoiZW4ifQ%3D%3D%22%7D" aria-label="Twitter"><Twitter size={20} /></a></li>
            <li><a href="https://www.linkedin.com/login" aria-label="LinkedIn"><Linkedin size={20} /></a></li>
            <li><a href="https://github.com/login" aria-label="GitHub"><Github size={20} /></a></li>
            <li><a href="https://www.youtube.com/" aria-label="YouTube"><Youtube size={20} /></a></li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; 2024 Vehicle Insurance Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

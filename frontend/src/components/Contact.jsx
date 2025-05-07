import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import styles from "../stylings/Contact.module.css";
import contactImage from "../assets/contactImage.jpg";

const Contact = () => {
  return (
    <section id="contact" className={styles.contact}>
      <h2>Contact Us</h2>
      <div className={styles.contactCard}>
        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <Phone className={styles.contactIcon} />
              <p>1-234-567-890</p>
            </div>
            <div className={styles.contactItem}>
              <Mail className={styles.contactIcon} />
              <p>info@nexusvehicleinsurance.com</p>
            </div>
            <div className={styles.contactItem}>
              <MapPin className={styles.contactIcon} />
              <p>123 Insurance Street, City, Country</p>
            </div>
          </div>
        </div>
        <div className={styles.contactImage}>
          <img src={contactImage} alt="Contact Us" />
        </div>
      </div>
    </section>
  );
}

export default Contact;

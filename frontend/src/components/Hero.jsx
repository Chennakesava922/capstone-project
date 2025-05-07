import React from 'react';
import styles from '../stylings/Hero.module.css';
import bannerImage from "../assets/image.png"

const Hero = () => {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>Vehicle Insurance Management System</h1>
        <p className={styles.heroDescription}>
          Protect your journey with comprehensive coverage that gives you peace of mind on every road. 
          Our advanced digital platform simplifies insurance management, offering real-time policy tracking, 
          instant claims processing, and personalized coverage options.
        </p>
        <p className={styles.heroFeatures}>
          ✓ Instant Policy Issuance & Digital Documentation<br />
          ✓ 24/7 Claim Assistance with Quick Settlement<br />
          ✓ Nationwide Network of Trusted Repair Centers<br />
          ✓ Flexible Payment Options & Discount Programs<br />
          ✓ Real-time Policy Management Dashboard<br />
          ✓ Mobile App for On-the-Go Management<br />
        </p>
      </div>
      <div className={styles.heroImage}>
        <img src={bannerImage} alt="Vehicle Insurance Illustration" />
      </div>
    </section>
  );
}

export default Hero;
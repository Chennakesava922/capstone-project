import React from 'react';
import { Shield, DollarSign, Users, Clock, FileCheck } from 'lucide-react';
import styles from '../stylings/Features.module.css';

const Features = () => {
  return (
    <section id="about" className={styles.features}>
      <h2>Why Choose Us?</h2>
      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <Shield className={styles.featureIcon} />
          <h3>Complete Protection</h3>
          <p>Comprehensive coverage for all types of vehicles with additional benefits</p>
        </div>
        <div className={styles.featureCard}>
          <DollarSign className={styles.featureIcon} />
          <h3>Best Rates</h3>
          <p>Competitive prices and flexible payment options tailored to your needs</p>
        </div>
        <div className={styles.featureCard}>
          <Users className={styles.featureIcon} />
          <h3>24/7 Support</h3>
          <p>Round-the-clock customer service with dedicated claim assistance</p>
        </div>
        <div className={styles.featureCard}>
          <Clock className={styles.featureIcon} />
          <h3>Quick Processing</h3>
          <p>Fast policy issuance and hassle-free claim settlements</p>
        </div>
        <div className={styles.featureCard}>
          <FileCheck className={styles.featureIcon} />
          <h3>Easy Claims</h3>
          <p>Simple and transparent claim process with minimal documentation</p>
        </div>
      </div>
    </section>
  );
}

export default Features;

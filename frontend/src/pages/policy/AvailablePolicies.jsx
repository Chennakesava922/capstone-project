import React from 'react';
import styles from "../../stylings/Policies.module.css";
import { Car, Bike, Truck, CarFront, Zap, IndianRupee, Shield } from 'lucide-react';

const Policies = () => {
  const policies = [
    {
      id: 1,
      name: 'Comprehensive Car Insurance',
      description: 'Complete protection for your car against damages, theft, and third-party liabilities',
      premium: '₹12000',
      coverage: '₹10,00,000',
      features: ['Own Damage Cover', 'Third Party Liability', 'Personal Accident Cover', 'Zero Depreciation'],
      icon: <Car size={32} />
    },
    {
      id: 2,
      name: 'Two-Wheeler Insurance',
      description: 'Protection for your bike/scooter with comprehensive coverage',
      premium: '₹5000',
      coverage: '₹5,00,000',
      features: ['Accident Cover', 'Theft Protection', 'Third Party Liability', 'Accessories Cover'],
      icon: <Bike size={32} />
    },
    {
      id: 3,
      name: 'Commercial Vehicle Insurance',
      description: 'Specialized insurance for commercial vehicles and business use',
      premium: '₹25000',
      coverage: '₹25,00,000',
      features: ['Public Liability', 'Goods in Transit', 'Driver Coverage', 'Breakdown Assistance'],
      icon: <Truck size={32} />
    },
    {
      id: 4,
      name: 'Rental Vehicle Insurance',
      description: 'Short-term insurance for rental vehicles with optional damage waivers',
      premium: '₹3500',
      coverage: '₹3,00,000',
      features: ['Short-Term Coverage', 'Collision Damage Waiver', '24x7 Support', 'Personal Accident'],
      icon: <CarFront size={32} />
    },
    {
      id: 5,
      name: 'Electric Vehicle Insurance',
      description: 'Custom policy for electric cars and bikes, covering unique EV risks and components',
      premium: '₹8000',
      coverage: '₹8,00,000',
      features: ['Battery Coverage', 'Charging Equipment Protection', 'Own Damage', 'Roadside EV Assistance'],
      icon: <Zap size={32} />
    }
  ];

  return (
    <div className={styles.policiesContainer}>
      <h1 className={styles.policiesTitle}>Nexus Insurance Policies</h1>
      <p className={styles.tag}>You can choose a policy according to your vehicle type from the below listed policies</p>
      <div className={styles.policiesGrid}>
        {policies.map((policy) => (
          <div key={policy.id} className={styles.policyCard}>
            <div className={styles.cardHeader}>
              <div className={styles.policyIcon}>{policy.icon}</div>
              <h2 className={styles.policyName}>{policy.name}</h2>
            </div>
            <p className={styles.policyDescription}>{policy.description}</p>

            <div className={styles.policyDetails}>
              <div className={styles.detailItem}>
                <IndianRupee size={20} />
                <span>Premium: {policy.premium}/year</span>
              </div>
              <div className={styles.detailItem}>
                <Shield size={20} />
                <span>Coverage: {policy.coverage}</span>
              </div>
            </div>

            <div className={styles.featuresSection}>
              <h3>Key Features:</h3>
              <ul className={styles.featuresList}>
                {policy.features.map((feature, index) => (
                  <li key={index}>
                    <span className={styles.featureDot}>•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Policies;

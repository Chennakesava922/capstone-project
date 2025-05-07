import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../../stylings/Policies.module.css";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Car, Bike, Truck, CarFront, Zap, IndianRupee, Shield } from 'lucide-react';

const Policies = () => {
  const navigate = useNavigate();
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [duration, setDuration] = useState('1');
  const [showDurationForm, setShowDurationForm] = useState(false);

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

  const handlePolicySelect = (policy) => {
    setSelectedPolicy(policy);
    setShowDurationForm(true);
  };

  const calculatePremium = (basePremium, years, vehicleType, usageType) => {
    const numericPremium = parseInt(basePremium.replace(/[^0-9]/g, ''));
    
    // Base premium calculation
    let calculatedPremium = numericPremium * years;
    
    // Vehicle type multipliers
    const vehicleTypeMultipliers = {
      'Comprehensive Car Insurance': 1.0,
      'Two-Wheeler Insurance': 0.6,
      'Commercial Vehicle Insurance': 1.5,
      'Rental Vehicle Insurance': 1.2,
      'Electric Vehicle Insurance': 1.1
    };
    
    // Usage type multipliers
    const usageTypeMultipliers = {
      'Personal': 1.0,
      'Commercial': 1.3,
      'Rental': 1.4
    };
    
    // Apply vehicle type multiplier
    calculatedPremium *= vehicleTypeMultipliers[vehicleType] || 1.0;
    
    // Apply usage type multiplier
    calculatedPremium *= usageTypeMultipliers[usageType] || 1.0;
    
    // Apply duration discount for longer terms
    if (years > 1) {
      const durationDiscount = 0.05 * (years - 1); // 5% discount per additional year
      calculatedPremium *= (1 - durationDiscount);
    }
    
    // Round to nearest 100
    calculatedPremium = Math.round(calculatedPremium / 100) * 100;
    
    return `₹${calculatedPremium}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const vehicleId = localStorage.getItem('VehicleId');
      if (!vehicleId) {
        toast.error('No vehicle ID found in localStorage');
        return;
      }

      const policiesUrl = import.meta.env.VITE_POLICIES_URL;

      // Calculate start and end dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + parseInt(duration));

      const policyData = {
        vehicleID: parseInt(vehicleId),
        policyType: selectedPolicy.name,
        coverageDetails: selectedPolicy.coverage,
        premiumAmount: calculatePremium(selectedPolicy.premium, parseInt(duration), selectedPolicy.name, localStorage.getItem('usageType')),
        status: 'Payment Pending',
        startDate: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        endDate: endDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
      };

      await axios.post(policiesUrl, policyData);
      toast.success('Policy created successfully!');

      setShowDurationForm(false);
      setSelectedPolicy(null);
      setDuration('1');
      navigate('/user/policies');
    } catch (error) {
      console.error('Error creating policy:', error);
      toast.error('Failed to create policy. Please try again.');
    }
  };

  return (
    <div className={styles.policiesContainer}>
      <h1 className={styles.policiesTitle}>Nexus Insurance Policies</h1>
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

            <button 
              className={styles.selectButton}
              onClick={() => handlePolicySelect(policy)}
            >
              Select Policy
            </button>
          </div>
        ))}
      </div>

      {showDurationForm && selectedPolicy && (
        <div className={styles.dateFormOverlay}>
          <div className={styles.dateFormContainer}>
            <h2>{selectedPolicy.name}</h2>
            <p>{selectedPolicy.description}</p>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Select Policy Duration:</label>
                <div className={styles.radioGroup}>
                  <table className={styles.durationTable}>
                    <thead>
                      <tr>
                        <th>Duration</th>
                        <th>Premium</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <label>
                            <input
                              type="radio"
                              value="1"
                              checked={duration === '1'}
                              onChange={(e) => setDuration(e.target.value)}
                            />
                            1 Year
                          </label>
                        </td>
                        <td>{calculatePremium(selectedPolicy.premium, 1, selectedPolicy.name, localStorage.getItem('usageType'))}</td>
                      </tr>
                      <tr>
                        <td>
                          <label>
                            <input
                              type="radio"
                              value="3"
                              checked={duration === '3'}
                              onChange={(e) => setDuration(e.target.value)}
                            />
                            3 Years
                          </label>
                        </td>
                        <td>{calculatePremium(selectedPolicy.premium, 3, selectedPolicy.name, localStorage.getItem('usageType'))}</td>
                      </tr>
                      <tr>
                        <td>
                          <label>
                            <input
                              type="radio"
                              value="5"
                              checked={duration === '5'}
                              onChange={(e) => setDuration(e.target.value)}
                            />
                            5 Years
                          </label>
                        </td>
                        <td>{calculatePremium(selectedPolicy.premium, 5, selectedPolicy.name, localStorage.getItem('usageType'))}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className={styles.formButtons}>
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowDurationForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Policies;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "../../stylings/Policies.module.css";

const AppliedPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('No user ID found');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_GET_POLICIES_URL}/user/${userId}`);
        console.log("Fetched policies:", response.data);
        setPolicies(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch policies');
        setLoading(false);
        console.error('Error fetching policies:', err);
      }
    };

    fetchPolicies();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.policiesContainer}>
      <h1 className={styles.policiesTitle}>Your Applied Policies</h1>
      <div className={styles.policiesGrid}>
        {policies.length === 0 ? (
          <p className={styles.noPolicies}>No policies found.</p>
        ) : (
          policies.map((item) => (
            <div className={styles.policyCard} key={item.policy.policyId}>
              <h2 className={styles.policyName}>{item.policy.policyType}</h2>
              <div className={styles.policyDetails}>
                <p><strong>Coverage:</strong> {item.policy.coverageDetails}</p>
                <p><strong>Premium:</strong> ₹{item.policy.premiumAmount}</p>
                <p><strong>Start Date:</strong> {new Date(item.policy.startDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(item.policy.endDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {item.policy.status}</p>
                <p><strong>Vehicle:</strong> {item.registrationNumber} ({item.model})</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppliedPolicies;
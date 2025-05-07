import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../stylings/AdminPolicies.module.css';

const AdminPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const VITE_POLICIES_URL = import.meta.env.VITE_GET_POLICIES_URL;

  const handleSendReminder = async ( userEmail) => {
    try {
      console.log(userEmail);
      const response = await axios.post('http://localhost:9000/api/reminder/send-renewal', {
        email: userEmail
      });
      if (response.data) {
        alert('Renewal reminder email sent successfully');
      } else {
        alert('Failed to send renewal reminder email');
      }
    } catch (err) {
      console.error('Error sending reminder:', err);
      alert('Failed to send renewal reminder email');
    }
  };

  const handleSendPaymentNotification = async (policyID, userEmail) => {
    try {
      console.log(policyID, userEmail);
      const response = await axios.post('http://localhost:9000/api/reminder/send-payment-notification', {
        policyID: policyID,
        email: userEmail
      });
      if (response.data) {
        alert('Payment notification email sent successfully');
      } else {
        alert('Failed to send payment notification email');
      }
    } catch (err) {
      console.error('Error sending payment notification:', err);
      alert('Failed to send payment notification email');
    }
  };

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        console.log('Fetching policies from:', VITE_POLICIES_URL);
        const response = await axios.get(VITE_POLICIES_URL);
        setPolicies(response.data);
        console.log('Policies fetched successfully:', response.data);
        setLoading(false);
      } catch (err) {
        console.error('Detailed error:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          headers: err.response?.headers
        });
        setError(`Failed to fetch policies: ${err.message}. Please check if the backend server is running.`);
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.adminPolicies}>
      <h1>Policies</h1>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Policy ID</th>
              <th>User Name</th>
              <th>Vehicle ID</th>
              <th>Policy Type</th>
              <th>Start Date(DD/MM/YYYY)</th>
              <th>End Date(DD/MM/YYYY)</th>
              <th>Premium Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy.policy.policyID}>
                <td>{policy.policy.policyID}</td>
                <td>{policy.name || 'N/A'}</td>
                <td>{policy.policy.vehicleID}</td>
                <td>{policy.policy.policyType}</td>
                <td>{new Date(policy.policy.startDate).toLocaleDateString()}</td>
                <td>{new Date(policy.policy.endDate).toLocaleDateString()}</td>
                <td>{policy.policy.premiumAmount}</td>
                <td>{policy.policy.status}</td>
                <td className={styles.actions}>
                  <button 
                    className={styles.reminderButton}
                    onClick={() => handleSendReminder( policy.email)}
                  >
                    Send Reminder
                  </button>
                  <button 
                    className={styles.paymentButton}
                    onClick={() => handleSendPaymentNotification(policy.policy.policyID, policy.email)}
                  >
                    Payment Due
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPolicies;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import styles from "../../stylings/Payment.module.css";

const Payment = () => {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    policyId,
    amount: 0,
    status: 'Pending'
  });

  useEffect(() => {
    const load = async () => {
      const loaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!loaded) {
        toast.error('Failed to load Razorpay SDK.');
      }
    };
    load();

    // Fetch policy details
    const fetchPolicyDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8183/api/policies/${policyId}`);
        const policy = response.data;
        const premiumAmount = parseInt(policy.premiumAmount.replace(/[^0-9]/g, ''));
        
        // Calculate monthly payment based on policy duration
        const startDate = new Date(policy.startDate);
        const endDate = new Date(policy.endDate);
        const durationInYears = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365);
        const monthlyAmount = Math.ceil(premiumAmount / (durationInYears * 12));

        setPaymentDetails(prev => ({
          ...prev,
          amount: monthlyAmount
        }));
      } catch (error) {
        console.error('Error fetching policy details:', error);
        toast.error('Failed to fetch policy details');
      }
    };

    fetchPolicyDetails();
  }, [policyId]);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    let paymentHandled = false;
    try {
      setLoading(true);

      const response = await axios.post('http://localhost:8187/api/payments/create', null, {
        params: {
          policyId,
          userId: localStorage.getItem('userId'),
          amount: paymentDetails.amount
        }
      });

      const { razorpayOrderId, amountPaid } = response.data;

      const options = {
        key: 'rzp_test_GVcvFVuozPTax4',
        amount: amountPaid * 100,
        currency: 'INR',
        name: 'Insurance Payment',
        description: 'Payment for Insurance Policy',
        order_id: razorpayOrderId,
        handler: async function () {
          if (paymentHandled) return;
          paymentHandled = true;

          await axios.post('http://localhost:8187/api/payments/update-status', null, {
            params: { razorpayOrderId, status: 'success' }
          });

          await axios.put(`http://localhost:8183/api/policies/${policyId}/status`, {
            status: 'Active'
          });

          toast.success('Payment Successful!');
          navigate('/user/policies');
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
        },
        theme: { color: '#3399cc' },
        modal: {
          ondismiss: async function () {
            if (paymentHandled) return;
            paymentHandled = true;

            await axios.post('http://localhost:8187/api/payments/update-status', null, {
              params: { razorpayOrderId, status: 'fail' }
            });

            await axios.put(`http://localhost:8183/api/policies/${policyId}/status`, {
              status: 'Payment Failed'
            });

            toast.error('Payment popup closed without completing payment');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Payment Details</h2>
        <table className={styles.paymentTable}>
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Policy ID</td>
              <td>{paymentDetails.policyId}</td>
            </tr>
            <tr>
              <td>Monthly Amount</td>
              <td>₹{paymentDetails.amount}</td>
            </tr>
            
          </tbody>
        </table>
        <button
          onClick={handlePayment}
          disabled={loading}
          className={styles.button}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

export default Payment;
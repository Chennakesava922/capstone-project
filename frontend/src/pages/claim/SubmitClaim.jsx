import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../stylings/SubmitClaim.module.css';
import awsService from '../../services/awsService';

const SubmitClaim = () => {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const [incidentDate, setIncidentDate] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('User not logged in. Please login to continue.');
        return;
      }

      // First, submit the claim
      const formData = new FormData();
      formData.append('policyId', policyId);
      formData.append('userId', userId);
      formData.append('incidentDate', incidentDate);
      formData.append('claimAmount', claimAmount);

      const claimResponse = await axios.post(
        `${import.meta.env.VITE_CLAIM_SERVICE_URL}/submit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const claimId = claimResponse.data.claimId;
      toast.success('Claim submitted successfully!');

      // Then, upload files to S3 if there are any
      if (files.length > 0) {
        try {
          await awsService.uploadToS3(files, claimId, userId);
          toast.success('Documents uploaded successfully!');
        } catch (error) {
          toast.error('Failed to upload documents. Please try again later.');
          console.error('Error uploading documents:', error);
        }
      }

      navigate('/user/claims');
    } catch (error) {
      toast.error('Failed to submit claim.');
      console.error('Error submitting claim:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.claimContainer}>
      <form onSubmit={handleSubmit} className={styles.claimCard}>
        <h1 className={styles.claimTitle}>Submit Claim</h1>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Policy ID:</label>
          <input type="text" value={policyId} readOnly className={styles.formInput} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Incident Date:</label>
          <input
            type="date"
            value={incidentDate}
            onChange={(e) => setIncidentDate(e.target.value)}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Claim Amount:</label>
          <input
            type="number"
            placeholder="Enter claim amount"
            value={claimAmount}
            onChange={(e) => setClaimAmount(e.target.value)}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Upload Documents:</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className={styles.formInput}
          />
          {files.length > 0 && (
            <div className={styles.fileList}>
              <p>Selected files: {files.length}</p>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={styles.formButtons}>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Claim'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitClaim;

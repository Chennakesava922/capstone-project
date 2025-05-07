import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import styles from '../../stylings/Claims.module.css';

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [claimDocuments, setClaimDocuments] = useState({});
  const [loading, setLoading] = useState(true);
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    fileUrl: null,
    fileName: null,
    fileType: null
  });

  const fetchDocumentsForClaim = async (claimId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOCUMENT_SERVICE_URL}/claim/${claimId}`);
      setClaimDocuments(prev => ({
        ...prev,
        [claimId]: response.data
      }));
    } catch (error) {
      console.error(`Error fetching documents for claim ${claimId}:`, error);
      toast.error(`Failed to fetch documents for claim ${claimId}`);
    }
  };

  async (claimId) => {
    try {
      const documents = claimDocuments[claimId] || [];
      if (documents.length === 0) {
        toast.error('No documents available for download');
        return;
      }

      // Create a zip file of all documents
      const response = await axios.get(
        `${import.meta.env.VITE_DOCUMENT_SERVICE_URL}/claim/${claimId}/download`,
        { responseType: 'blob' }
      );

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `claim_${claimId}_documents.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Documents downloaded successfully');
    } catch (error) {
      console.error('Error downloading documents:', error);
      toast.error('Failed to download documents');
    }
  };

  const handleDocumentClick = (fileUrl, fileName) => {
    // Check if the file is an image
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
    const isPdf = /\.pdf$/i.test(fileName);

    if (!isImage && !isPdf) {
      toast.error('Preview is only available for images and PDFs');
      return;
    }

    setPreviewModal({
      isOpen: true,
      fileUrl,
      fileName,
      fileType: isImage ? 'image' : 'pdf'
    });
  };

  const closePreviewModal = () => {
    setPreviewModal({
      isOpen: false,
      fileUrl: null,
      fileName: null,
      fileType: null
    });
  };

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          toast.error('User not logged in');
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_CLAIM_SERVICE_URL}/user/${userId}`);
        setClaims(response.data);
        
        // Fetch documents for each claim
        for (const claim of response.data) {
          await fetchDocumentsForClaim(claim.claimId);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching claims:', error);
        toast.error('Failed to fetch claims');
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading claims...</div>;
  }

  return (
    <div className={styles.policiesContainer}>
      <h1 className={styles.policiesTitle}>Claims</h1>
      {claims.length === 0 ? (
        <p className={styles.error}>No claims found.</p>
      ) : (
        <div className={styles.policiesList}>
          {claims.map((claim) => {
            const documents = claimDocuments[claim.claimId] || [];
            //const firstDocument = documents[0];
            
            return (
              <div key={claim.claimId} className={styles.policyCard}>
                <div className={styles.policyHeader}>
                  <span className={styles.policyId}>Claim #{claim.claimId}</span>
                  <span className={`${styles.policyStatus} ${styles[`status${claim.status}`]}`}>
                    {claim.status}
                  </span>
                </div>

                <div className={styles.policyDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Policy ID</span>
                    <span className={styles.detailValue}>{claim.policyId}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Incident Date</span>
                    <span className={styles.date}>{new Date(claim.incidentDate).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Claim Amount</span>
                    <span className={styles.amount}>₹{claim.claimAmount}</span>
                  </div>
                </div>
                
                <div className={styles.documentsSection}>
                  <h4 className={styles.documentsTitle}>Claim Documents</h4>
                  <div className={styles.documentsList}>
                    {documents.map((doc) => {
                      if (!doc) return null;
                      
                      const fileName = doc.file_name || doc.fileName || 'Unnamed Document';
                      const fileUrl = doc.file_url || doc.fileUrl;
                      
                      return (
                        <div 
                          key={doc.document_id || doc.documentId} 
                          className={styles.documentItem}
                          onClick={() => handleDocumentClick(fileUrl, fileName)}
                        >
                          <span className={styles.documentName}>{fileName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewModal.isOpen && (
        <div className={styles.previewModal}>
          <div className={styles.previewModalContent}>
            <div className={styles.previewModalHeader}>
              <h3>{previewModal.fileName}</h3>
              <button onClick={closePreviewModal} className={styles.closeButton}>×</button>
            </div>
            <div className={styles.previewModalBody}>
              {previewModal.fileType === 'image' ? (
                <img 
                  src={previewModal.fileUrl} 
                  alt={previewModal.fileName}
                  className={styles.previewImage}
                  onError={(e) => {
                    toast.error('Failed to load image preview');
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <iframe 
                  src={previewModal.fileUrl} 
                  title="Document Preview"
                  className={styles.previewIframe}
                />
              )}
            </div>
            <div className={styles.previewModalFooter}>
              <button 
                onClick={() => window.open(previewModal.fileUrl, '_blank')}
                className={styles.downloadButton}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Claims; 
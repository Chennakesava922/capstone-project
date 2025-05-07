import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import styles from "../../stylings/AdminClaims.module.css"

const AdminClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimDocuments, setClaimDocuments] = useState({});
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    fileUrl: null,
    fileName: null,
    fileType: null
  });

  const fetchDocumentsForClaim = async (claimId) => {
    try {
      const response = await axios.get(`http://localhost:8186/api/documents/claim/${claimId}`);
      setClaimDocuments(prev => ({
        ...prev,
        [claimId]: response.data
      }));
    } catch (error) {
      console.error(`Error fetching documents for claim ${claimId}:`, error);
    }
  };

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8184/api/claims', {
          
        });
        setClaims(response.data);
        console.log(response.data)
        // Fetch documents for each claim
        for (const claim of response.data) {
          await fetchDocumentsForClaim(claim.claimId);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch claims');
        setLoading(false);
        console.error('Error fetching claims:', err);
      }
    };

    fetchClaims();
  }, []);

  const handleStatusUpdate = async (claimId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8184/api/claims/${claimId}`,
        { status: newStatus },
       
      );
      
      // Update the claims list with the new status
      setClaims(claims.map(claim => 
        claim.claimId === claimId 
          ? { ...claim, status: newStatus }
          : claim
      ));
    } catch (err) {
      setError('Failed to update claim status');
      console.error('Error updating claim status:', err);
    }
  };

  const handleDocumentClick = (fileUrl, fileName) => {
    const fileType = fileName.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image';
    setPreviewModal({
      isOpen: true,
      fileUrl,
      fileName,
      fileType
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

  if (loading) return <div className={styles.loading}>Loading claims...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.usersContainer} style={{ padding: '1rem' }}>
      <h2 className={styles.heading} style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>📋 All Claims</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th} style={{ padding: '0.75rem' }}>Claim ID</th>
              <th className={styles.th} style={{ padding: '0.75rem' }}>Policy ID</th>
              <th className={styles.th} style={{ padding: '0.75rem' }}>User ID</th>
              <th className={styles.th} style={{ padding: '0.75rem' }}>Status</th>
              <th className={styles.th} style={{ padding: '0.75rem' }}>Amount</th>
              <th className={styles.th} style={{ padding: '0.75rem' }}>Incident Date(DD/MM/YYYY)</th>
              <th className={styles.th} style={{ padding: '0.75rem' }}>Documents</th>
              <th className={styles.th} style={{ padding: '0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.claimId}>
                <td className={styles.td} style={{ padding: '0.5rem 0.75rem' }}>{claim.claimId}</td>
                <td className={styles.td} style={{ padding: '0.5rem 0.75rem' }}>{claim.policyId}</td>
                <td className={styles.td} style={{ padding: '0.5rem 0.75rem' }}>{claim.userId}</td>
                <td className={styles.td} style={{ padding: '0.5rem 0.75rem' }}>{claim.status}</td>
                <td className={styles.td} style={{ padding: '0.5rem 0.75rem' }}>₹{claim.claimAmount}</td>
                <td className={styles.td} style={{ padding: '0.5rem 0.75rem' }}>{new Date(claim.incidentDate).toLocaleDateString()}</td>
                <td className={styles.td} style={{ padding: '0.5rem 0.75rem' }}>
                  <div className={styles.documentsContainer}>
                    {claimDocuments[claim.claimId]?.length > 0 ? (
                      claimDocuments[claim.claimId].map((doc) => (
                        <div key={doc.documentId} className={styles.documentItem}>
                          <span 
                            className={styles.documentName}
                            onClick={() => handleDocumentClick(doc.fileUrl, doc.fileName)}
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            {doc.fileName}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className={styles.noDocuments}>No documents found</div>
                    )}
                  </div>
                </td>
                <td className={styles.td} style={{ padding: '0.5rem 0.75rem' }}>
                  <button 
                    className={styles.actionsButton}
                    onClick={() => handleStatusUpdate(claim.claimId, 'APPROVED')}
                    disabled={claim.status === 'APPROVED' || claim.status === 'REJECTED'}
                    style={{ 
                      background: claim.status === 'APPROVED' 
                        ? 'linear-gradient(135deg, #4CAF50, #45a049)' 
                        : 'linear-gradient(135deg, #4CAF50, #45a049)',
                      opacity: claim.status === 'APPROVED' || claim.status === 'REJECTED' ? 0.5 : 1,
                      padding: '6px 12px',
                      fontSize: '0.9rem'
                    }}
                  >
                    Accept
                  </button>
                  <button 
                    className={styles.actionsButton}
                    onClick={() => handleStatusUpdate(claim.claimId, 'REJECTED')}
                    disabled={claim.status === 'REJECTED' || claim.status === 'APPROVED'}
                    style={{ 
                      background: claim.status === 'REJECTED' 
                        ? 'linear-gradient(135deg, #ff416c, #ff4b2b)' 
                        : 'linear-gradient(135deg, #ff416c, #ff4b2b)',
                      opacity: claim.status === 'REJECTED' || claim.status === 'APPROVED' ? 0.5 : 1,
                      marginLeft: '8px',
                      padding: '6px 12px',
                      fontSize: '0.9rem'
                    }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

export default AdminClaims; 
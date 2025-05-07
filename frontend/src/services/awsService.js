import axios from 'axios';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const awsService = {
  uploadToS3: async (files, claimId, userId) => {
    try {
      // Check file sizes
      for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`File ${file.name} exceeds the maximum size limit of 10MB`);
        }
      }

      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('claimId', claimId);
      formData.append('userId', userId);

      const response = await axios.post(
        `${import.meta.env.VITE_DOCUMENT_SERVICE_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          maxContentLength: MAX_FILE_SIZE,
          maxBodyLength: MAX_FILE_SIZE,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Error uploading files');
      } else if (error.request) {
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        throw new Error(error.message || 'Error uploading files');
      }
    }
  },
};

export default awsService; 
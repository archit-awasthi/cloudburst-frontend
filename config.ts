
export const API_BASE_URL: string = "https://cloudburst-backend.onrender.com";

// Direct download link for the extension zip file
export const EXTENSION_DOWNLOAD_LINK: string = "https://raw.githubusercontent.com/archit-awasthi/cloudburst-mainextension/main/cloudburst-mainextension.zip"; 

export const API_ENDPOINTS = {
  // Matches the extension's POST endpoint path structure
  UPLOAD_HISTORY: `${API_BASE_URL}/api/upload-history`,
  
  // Function to get the URL for a specific report
  GET_REPORT: (id: string) => `${API_BASE_URL}/api/report/${id}`,
};

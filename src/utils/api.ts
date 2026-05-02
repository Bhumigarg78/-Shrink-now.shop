// On Vercel: uses relative /api (same domain, serverless function)
// On local dev: falls back to localhost:5000
export const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

export const saveCompressionRecord = async (data: {
  fileName: string;
  fileType: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}) => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await fetch(`${API_URL}/compression/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error saving compression record:', error);
  }
};

export const getCompressionHistory = async () => {
  const token = localStorage.getItem('token');
  if (!token) return [];

  try {
    const response = await fetch(`${API_URL}/compression/history`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching compression history:', error);
    return [];
  }
};

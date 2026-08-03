const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // For 204 No Content, just return success
    if (response.status === 204) {
      return { success: true, data: null };
    }

    const text = await response.text();
    let data = null;
    
    if (text) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = text;
        }
      } else {
        data = text;
      }
    }

    if (response.ok) {
      return { success: true, data };
    } else {
      const errorMsg = (data && (data.msg || data.err)) || 'Something went wrong. Please try again.';
      return { 
        success: false, 
        error: errorMsg
      };
    }
  } catch (error) {
    console.error('API Request Error:', error);
    return { 
      success: false, 
      error: 'Network error. Please make sure the server is running.' 
    };
  }
};

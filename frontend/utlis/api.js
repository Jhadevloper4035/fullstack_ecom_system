const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  // GET request
  get: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      credentials: 'include', // Important for cookies/sessions
    });
    return handleResponse(response);
  },

  // POST request
  post: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // PUT request
  put: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // DELETE request
  delete: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return handleResponse(response);
  },
};

// Handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};
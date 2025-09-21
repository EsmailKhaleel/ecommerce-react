class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const handleApiError = (error, customMessage) => {
  if (error.response) {
    // Server responded with an error status
    throw new ApiError(
      error.response.data.message || customMessage,
      error.response.status,
      error.response.data
    );
  } else if (error.request) {
    // Request was made but no response received
    throw new ApiError(
      'No response from server. Please check your connection.',
      'NETWORK_ERROR'
    );
  } else {
    throw new ApiError(
      error.message || 'An unexpected error occurred',
      'CLIENT_ERROR'
    );
  }
};
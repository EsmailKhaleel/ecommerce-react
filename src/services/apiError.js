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
    // The API reports failures as { message } in some modules and { error } in
    // others, so accept either before falling back.
    const data = error.response.data;
    const serverMessage =
      typeof data === 'string' ? data : data?.message || data?.error;

    throw new ApiError(
      serverMessage || customMessage,
      error.response.status,
      data
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
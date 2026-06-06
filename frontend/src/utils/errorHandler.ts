import toast from 'react-hot-toast';

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

export class ErrorHandler {
  static handleApiError(error: any): ApiError {
    // Network error
    if (!error.response) {
      const networkError: ApiError = {
        message: 'Network error. Please check your connection and try again.',
        status: 0
      };
      toast.error(networkError.message);
      return networkError;
    }

    // HTTP error with response
    const status = error.response.status;
    const data = error.response.data;

    let message = 'An unexpected error occurred';
    let details = null;

    // Extract error message from response
    if (data?.error?.message) {
      message = data.error.message;
      details = data.error.details;
    } else if (data?.message) {
      message = data.message;
    } else {
      // Default messages for common HTTP status codes
      switch (status) {
        case 400:
          message = 'Invalid request. Please check your input.';
          break;
        case 401:
          message = 'Authentication required. Please log in again.';
          break;
        case 403:
          message = 'Access denied. You don\'t have permission for this action.';
          break;
        case 404:
          message = 'The requested resource was not found.';
          break;
        case 409:
          message = 'Conflict. The resource already exists or is in use.';
          break;
        case 413:
          message = 'File too large. Please choose a smaller file.';
          break;
        case 415:
          message = 'Unsupported file type.';
          break;
        case 429:
          message = 'Too many requests. Please wait a moment and try again.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        case 502:
        case 503:
        case 504:
          message = 'Service temporarily unavailable. Please try again later.';
          break;
      }
    }

    const apiError: ApiError = { message, status, details };
    
    // Don't show toast for 401 errors (handled by auth interceptor)
    if (status !== 401) {
      toast.error(message);
    }

    return apiError;
  }

  static handleFileUploadError(error: any): ApiError {
    const apiError = this.handleApiError(error);
    
    // Add specific file upload context
    if (apiError.status === 413) {
      apiError.message = 'File is too large. Maximum size is 100MB.';
    } else if (apiError.status === 415) {
      apiError.message = 'File type not supported. Please choose a different file.';
    } else if (!apiError.status) {
      apiError.message = 'Upload failed. Please check your connection and try again.';
    }

    return apiError;
  }

  static handleAuthError(error: any): ApiError {
    const apiError = this.handleApiError(error);
    
    // Add specific auth context
    if (apiError.status === 401) {
      apiError.message = 'Invalid email or password.';
    } else if (apiError.status === 409) {
      apiError.message = 'An account with this email already exists.';
    } else if (!apiError.status) {
      apiError.message = 'Authentication failed. Please check your connection.';
    }

    return apiError;
  }

  static logError(error: any, context?: string) {
    const timestamp = new Date().toISOString();
    const errorInfo = {
      timestamp,
      context,
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    console.error('Application Error:', errorInfo);

    // In production, you might want to send this to an error tracking service
    if (import.meta.env.PROD) {
      // Example: Send to error tracking service
      // errorTrackingService.captureException(error, errorInfo);
    }
  }

  static showSuccessMessage(message: string) {
    toast.success(message);
  }

  static showWarningMessage(message: string) {
    toast(message, {
      icon: '⚠️',
      style: {
        background: '#FEF3C7',
        color: '#92400E',
        border: '1px solid #F59E0B'
      }
    });
  }

  static showInfoMessage(message: string) {
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#DBEAFE',
        color: '#1E40AF',
        border: '1px solid #3B82F6'
      }
    });
  }
}

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  ErrorHandler.logError(event.reason, 'Unhandled Promise Rejection');
  event.preventDefault();
});

// Global error handler for uncaught exceptions
window.addEventListener('error', (event) => {
  ErrorHandler.logError(event.error, 'Uncaught Exception');
});

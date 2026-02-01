export interface ErrorResponse {
  error: boolean;
  message: string;
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return getUserFriendlyMessage(error.message);
  }
  if (typeof error === 'string') {
    return getUserFriendlyMessage(error);
  }
  return 'Something went wrong. Please try again.';
};

const errorMap: Record<string, string> = {
  'Network request failed': 'Connection error. Please check your internet connection.',
  'Invalid credentials': 'Email or password is incorrect.',
  'User not found': 'No account found with this email address.',
  'Email already exists': 'An account with this email already exists.',
  'Invalid email': 'Please enter a valid email address.',
  'Password too short': 'Password must be at least 10 characters long.',
  'Unauthorized': 'You do not have permission to perform this action.',
  'Session expired': 'Your session has expired. Please log in again.',
  'Too many requests': 'Too many attempts. Please try again later.',
  'Server error': 'Server error. Our team has been notified.',
};

const getUserFriendlyMessage = (error: string): string => {
  for (const [key, value] of Object.entries(errorMap)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  return error || 'Something went wrong. Please try again.';
};

export const handleError = (error: unknown, context?: string): ErrorResponse => {
  const message = getErrorMessage(error);

  return {
    error: true,
    message,
  };
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.toLowerCase().includes('network') ||
           error.message.toLowerCase().includes('fetch');
  }
  return false;
};

export const isAuthError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return msg.includes('unauthorized') ||
           msg.includes('credentials') ||
           msg.includes('session') ||
           msg.includes('auth');
  }
  return false;
};

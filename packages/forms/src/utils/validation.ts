import { z } from 'zod';

// Common validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphabetic: /^[a-zA-Z]+$/,
  numeric: /^\d+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
} as const;

// Common validation schemas
export const commonSchemas = {
  email: z.string().email('Please enter a valid email address'),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  
  phone: z
    .string()
    .regex(VALIDATION_PATTERNS.phone, 'Please enter a valid phone number'),
  
  url: z
    .string()
    .url('Please enter a valid URL'),
  
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  age: z
    .number()
    .min(13, 'You must be at least 13 years old')
    .max(120, 'Please enter a valid age'),
  
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
  
  creditCard: z
    .string()
    .regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, 'Please enter a valid credit card number'),
  
  ssn: z
    .string()
    .regex(/^\d{3}-?\d{2}-?\d{4}$/, 'Please enter a valid SSN'),
};

// Validation helper functions
export function validateEmail(email: string): boolean {
  return VALIDATION_PATTERNS.email.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'fair' | 'good' | 'strong';
} {
  const errors: string[] = [];
  let score = 0;

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score += 1;
  }

  let strength: 'weak' | 'fair' | 'good' | 'strong';
  if (score <= 2) strength = 'weak';
  else if (score <= 3) strength = 'fair';
  else if (score <= 4) strength = 'good';
  else strength = 'strong';

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

export function validatePhone(phone: string): boolean {
  return VALIDATION_PATTERNS.phone.test(phone);
}

export function validateUrl(url: string): boolean {
  return VALIDATION_PATTERNS.url.test(url);
}

export function validateCreditCard(cardNumber: string): {
  isValid: boolean;
  type: string | null;
} {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  // Check if it's all digits
  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, type: null };
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  const isValid = sum % 10 === 0;
  
  // Determine card type
  let type: string | null = null;
  if (isValid) {
    if (/^4/.test(cleaned)) type = 'Visa';
    else if (/^5[1-5]/.test(cleaned)) type = 'MasterCard';
    else if (/^3[47]/.test(cleaned)) type = 'American Express';
    else if (/^6/.test(cleaned)) type = 'Discover';
  }
  
  return { isValid, type };
}

// Custom validation functions
export function createMinLengthValidator(minLength: number) {
  return (value: string) => {
    if (value.length < minLength) {
      return `Must be at least ${minLength} characters`;
    }
    return true;
  };
}

export function createMaxLengthValidator(maxLength: number) {
  return (value: string) => {
    if (value.length > maxLength) {
      return `Must be no more than ${maxLength} characters`;
    }
    return true;
  };
}

export function createPatternValidator(pattern: RegExp, message: string) {
  return (value: string) => {
    if (!pattern.test(value)) {
      return message;
    }
    return true;
  };
}

export function createCustomValidator<T>(
  validator: (value: T) => boolean,
  message: string
) {
  return (value: T) => {
    if (!validator(value)) {
      return message;
    }
    return true;
  };
}

// Async validation
export async function validateEmailExists(email: string): Promise<boolean> {
  // This would typically make an API call to check if email exists
  // For now, return a mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(!email.includes('taken'));
    }, 500);
  });
}

export async function validateUsernameAvailable(username: string): Promise<boolean> {
  // This would typically make an API call to check username availability
  // For now, return a mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(!username.includes('admin'));
    }, 500);
  });
}

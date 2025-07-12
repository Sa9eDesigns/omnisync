import { z } from 'zod';

// Email validation
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const emailSchema = z.string().email();
  const result = emailSchema.safeParse(email);
  
  if (result.success) {
    return { isValid: true };
  }
  
  return {
    isValid: false,
    error: 'Please enter a valid email address',
  };
}

// Password validation with detailed feedback
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'fair' | 'good' | 'strong';
  score: number;
} {
  const errors: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    score += 1;
    if (password.length >= 12) {
      score += 1;
    }
  }

  // Character variety checks
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
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

  // Common patterns check
  const commonPatterns = [
    /(.)\1{2,}/, // Repeated characters
    /123|234|345|456|567|678|789|890/, // Sequential numbers
    /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i, // Sequential letters
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('Avoid common patterns like repeated or sequential characters');
      score = Math.max(0, score - 1);
      break;
    }
  }

  // Common passwords check
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey',
    '1234567890', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'
  ];

  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('This password is too common');
    score = 0;
  }

  // Determine strength
  let strength: 'weak' | 'fair' | 'good' | 'strong';
  if (score <= 2) {
    strength = 'weak';
  } else if (score <= 4) {
    strength = 'fair';
  } else if (score <= 5) {
    strength = 'good';
  } else {
    strength = 'strong';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score: Math.max(0, Math.min(6, score)),
  };
}

// Name validation
export function validateName(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim().length < 2) {
    return {
      isValid: false,
      error: 'Name must be at least 2 characters long',
    };
  }

  if (name.length > 50) {
    return {
      isValid: false,
      error: 'Name must be less than 50 characters',
    };
  }

  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return {
      isValid: false,
      error: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    };
  }

  return { isValid: true };
}

// Username validation
export function validateUsername(username: string): { isValid: boolean; error?: string } {
  if (!username || username.length < 3) {
    return {
      isValid: false,
      error: 'Username must be at least 3 characters long',
    };
  }

  if (username.length > 20) {
    return {
      isValid: false,
      error: 'Username must be less than 20 characters',
    };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      isValid: false,
      error: 'Username can only contain letters, numbers, underscores, and hyphens',
    };
  }

  if (/^[0-9_-]/.test(username)) {
    return {
      isValid: false,
      error: 'Username must start with a letter',
    };
  }

  return { isValid: true };
}

// Phone number validation (basic)
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  
  if (!phoneRegex.test(phone)) {
    return {
      isValid: false,
      error: 'Please enter a valid phone number',
    };
  }

  return { isValid: true };
}

// Age validation
export function validateAge(age: number): { isValid: boolean; error?: string } {
  if (age < 13) {
    return {
      isValid: false,
      error: 'You must be at least 13 years old',
    };
  }

  if (age > 120) {
    return {
      isValid: false,
      error: 'Please enter a valid age',
    };
  }

  return { isValid: true };
}

// Generic field validation
export function validateRequired(value: any, fieldName: string): { isValid: boolean; error?: string } {
  if (value === null || value === undefined || value === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  return { isValid: true };
}

// Terms acceptance validation
export function validateTermsAcceptance(accepted: boolean): { isValid: boolean; error?: string } {
  if (!accepted) {
    return {
      isValid: false,
      error: 'You must accept the terms and conditions',
    };
  }

  return { isValid: true };
}

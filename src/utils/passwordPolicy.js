export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;

const BLOCKED_FRAGMENTS = [
  'password',
  'passw0rd',
  'qwerty',
  'admin',
  'dunas',
  'letmein',
  'welcome',
  '123456',
];

export function getPasswordValidationErrors(password) {
  const value = typeof password === 'string' ? password : '';
  const errors = [];

  if (value.length < PASSWORD_MIN_LENGTH || value.length > PASSWORD_MAX_LENGTH) {
    errors.push('length');
  }

  if (BLOCKED_FRAGMENTS.some((fragment) => value.toLowerCase().includes(fragment))) {
    errors.push('predictable');
  }

  const characterClasses = [
    /[a-z]/.test(value),
    /[A-Z]/.test(value),
    /\d/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ].filter(Boolean).length;
  if (characterClasses < 3) {
    errors.push('characterClasses');
  }

  if (/(.)\1{4,}/.test(value)) {
    errors.push('repeatedSequence');
  }

  return errors;
}

export function isPasswordValid(password) {
  return getPasswordValidationErrors(password).length === 0;
}

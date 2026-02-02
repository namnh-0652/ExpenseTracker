/**
 * Storage Service
 * localStorage wrapper with error handling
 */

class StorageError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'StorageError';
    this.originalError = originalError;
  }
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {*} data - Data to store (will be JSON.stringify'd)
 * @throws {StorageError} if save fails
 */
export function save(key, data) {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      throw new StorageError('Storage quota exceeded. Please clear some data.', error);
    }
    throw new StorageError(`Failed to save data to key "${key}"`, error);
  }
}

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Value to return if key doesn't exist
 * @returns {*} Parsed data or defaultValue
 * @throws {StorageError} if parsing fails
 */
export function load(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    throw new StorageError(`Failed to parse data from key "${key}"`, error);
  }
}

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 */
export function remove(key) {
  localStorage.removeItem(key);
}

/**
 * Check if a key exists
 * @param {string} key - Storage key
 * @returns {boolean} true if exists
 */
export function exists(key) {
  return localStorage.getItem(key) !== null;
}

/**
 * Get storage size estimate in bytes
 * @param {string} key - Storage key
 * @returns {number} Size in bytes
 */
export function getSize(key) {
  const item = localStorage.getItem(key);
  if (item === null) {
    return 0;
  }
  // Rough estimate: JavaScript strings are UTF-16, so 2 bytes per character
  return item.length * 2;
}

/**
 * Backup data with timestamp
 * @param {string} key - Storage key to backup
 * @returns {string} Backup key name
 * @throws {StorageError} if backup fails
 */
export function backup(key) {
  const data = load(key, null);
  if (data === null) {
    throw new StorageError(`Cannot backup non-existent key "${key}"`);
  }
  
  const timestamp = Date.now();
  const backupKey = `${key}-backup-${timestamp}`;
  save(backupKey, data);
  
  return backupKey;
}

export { StorageError };

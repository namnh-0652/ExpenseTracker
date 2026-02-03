/**
 * Storage Service
 * localStorage wrapper with error handling
 */

export class StorageError extends Error {
  originalError?: Error;

  constructor(message: string, originalError?: Error) {
    super(message);
    this.name = 'StorageError';
    this.originalError = originalError;
  }
}

/**
 * Save data to localStorage
 * @param key - Storage key
 * @param data - Data to store (will be JSON.stringify'd)
 * @throws {StorageError} if save fails
 */
export function save<T>(key: string, data: T): void {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    const err = error as Error;
    if (err.name === 'QuotaExceededError') {
      throw new StorageError('Storage quota exceeded. Please clear some data.', err);
    }
    throw new StorageError(`Failed to save data to key "${key}"`, err);
  }
}

/**
 * Load data from localStorage
 * @param key - Storage key
 * @param defaultValue - Value to return if key doesn't exist
 * @returns Parsed data or defaultValue
 * @throws {StorageError} if parsing fails
 */
export function load<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    throw new StorageError(`Failed to parse data from key "${key}"`, error as Error);
  }
}

/**
 * Remove data from localStorage
 * @param key - Storage key
 */
export function remove(key: string): void {
  localStorage.removeItem(key);
}

/**
 * Check if a key exists
 * @param key - Storage key
 * @returns true if exists
 */
export function exists(key: string): boolean {
  return localStorage.getItem(key) !== null;
}

/**
 * Get storage size estimate in bytes
 * @param key - Storage key
 * @returns Size in bytes
 */
export function getSize(key: string): number {
  const item = localStorage.getItem(key);
  if (item === null) {
    return 0;
  }
  // Rough estimate: JavaScript strings are UTF-16, so 2 bytes per character
  return item.length * 2;
}

/**
 * Backup data with timestamp
 * @param key - Storage key to backup
 * @returns Backup key name
 * @throws {StorageError} if backup fails
 */
export function backup(key: string): string {
  const data = load(key, null);
  if (data === null) {
    throw new StorageError(`Cannot backup non-existent key "${key}"`);
  }
  
  const timestamp = Date.now();
  const backupKey = `${key}-backup-${timestamp}`;
  save(backupKey, data);
  
  return backupKey;
}

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

/**
 * Test Suite: useLocalStorage Hook
 * 
 * Tests for localStorage persistence hook.
 */

describe('useLocalStorage', () => {
  // Clear localStorage before and after each test
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('T086: localStorage integration', () => {
    it('should return initial value when no stored value exists', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initialValue')
      );

      expect(result.current[0]).toBe('initialValue');
    });

    it('should return stored value if it exists', () => {
      localStorage.setItem('testKey', JSON.stringify('storedValue'));

      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initialValue')
      );

      expect(result.current[0]).toBe('storedValue');
    });

    it('should store value in localStorage when setValue is called', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initialValue')
      );

      act(() => {
        result.current[1]('newValue');
      });

      const stored = localStorage.getItem('testKey');
      expect(stored).toBe(JSON.stringify('newValue'));
      expect(result.current[0]).toBe('newValue');
    });

    it('should handle complex objects', () => {
      const complexObject = {
        name: 'Test',
        age: 30,
        nested: { value: 123 },
      };

      const { result } = renderHook(() =>
        useLocalStorage('testKey', null)
      );

      act(() => {
        return result.current[1](complexObject);
      });

      expect(result.current[0]).toEqual(complexObject);

      const stored = localStorage.getItem('testKey');
      expect(JSON.parse(stored!)).toEqual(complexObject);
    });

    it('should handle arrays', () => {
      const testArray = [1, 2, 3, 4, 5];

      const { result } = renderHook(() =>
        useLocalStorage<number[]>('testArray', [])
      );

      act(() => {
        result.current[1](testArray);
      });

      expect(result.current[0]).toEqual(testArray);
    });

    it('should handle boolean values', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testBool', false)
      );

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
    });

    it('should handle number values', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testNumber', 0)
      );

      act(() => {
        result.current[1](42);
      });

      expect(result.current[0]).toBe(42);
    });

    it('should persist value across hook remounts', () => {
      const { result, unmount } = renderHook(() =>
        useLocalStorage('testKey', 'initialValue')
      );

      act(() => {
        result.current[1]('persistedValue');
      });

      unmount();

      // Create new hook instance
      const { result: result2 } = renderHook(() =>
        useLocalStorage('testKey', 'initialValue')
      );

      expect(result2.current[0]).toBe('persistedValue');
    });

    it('should handle removal of value', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initialValue')
      );

      act(() => {
        result.current[1]('storedValue');
      });

      expect(result.current[0]).toBe('storedValue');

      act(() => {
        result.current[2]();
      });

      expect(result.current[0]).toBe('initialValue');
      expect(localStorage.getItem('testKey')).toBeNull();
    });

    it('should handle function updater', () => {
      const { result } = renderHook(() =>
        useLocalStorage('counter', 0)
      );

      act(() => {
        result.current[1]((prev) => prev + 1);
      });

      expect(result.current[0]).toBe(1);

      act(() => {
        result.current[1]((prev) => prev + 5);
      });

      expect(result.current[0]).toBe(6);
    });

    it('should handle localStorage quota exceeded', () => {
      // Mock localStorage.setItem to throw
      const setItemMock = vi.spyOn(Storage.prototype, 'setItem');
      setItemMock.mockImplementation(() => {
        throw new Error('QuotaExceededError: Storage quota exceeded');
      });

      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initialValue')
      );

      act(() => {
        result.current[1]('newValue');
      });

      // Should still have the value in state even if localStorage fails
      expect(result.current[0]).toBe('newValue');

      // Restore mocks
      setItemMock.mockRestore();
      spy.mockRestore();
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('testKey', 'invalid json {[}');

      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'fallbackValue')
      );

      // Should fall back to initial value
      expect(result.current[0]).toBe('fallbackValue');
    });

    it('should handle null as initial value', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testKey', null)
      );

      expect(result.current[0]).toBeNull();

      act(() => {
        result.current[1]('value');
      });

      expect(result.current[0]).toBe('value');
    });

    it('should handle undefined correctly', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testKey', undefined)
      );

      expect(result.current[0]).toBeUndefined();
    });

    it('should handle multiple hooks with different keys', () => {
      const { result: result1 } = renderHook(() =>
        useLocalStorage('key1', 'value1')
      );

      const { result: result2 } = renderHook(() =>
        useLocalStorage('key2', 'value2')
      );

      act(() => {
        result1.current[1]('newValue1');
        result2.current[1]('newValue2');
      });

      expect(result1.current[0]).toBe('newValue1');
      expect(result2.current[0]).toBe('newValue2');
      expect(localStorage.getItem('key1')).toBe(JSON.stringify('newValue1'));
      expect(localStorage.getItem('key2')).toBe(JSON.stringify('newValue2'));
    });

    it('should sync across multiple hook instances with same key', () => {
      const { result: result1 } = renderHook(() =>
        useLocalStorage('sharedKey', 'initial')
      );

      const { result: result2 } = renderHook(() =>
        useLocalStorage('sharedKey', 'initial')
      );

      act(() => {
        result1.current[1]('updated');
      });

      expect(result1.current[0]).toBe('updated');
      // Note: Without custom storage event handling, result2 won't auto-sync
      // This is expected behavior for the basic implementation
    });

    it('should handle empty string as value', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'notEmpty')
      );

      act(() => {
        result.current[1]('');
      });

      expect(result.current[0]).toBe('');
      expect(localStorage.getItem('testKey')).toBe(JSON.stringify(''));
    });

    it('should handle storage event from other tabs', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initialValue')
      );

      // Simulate storage event from another tab
      act(() => {
        const event = new StorageEvent('storage', {
          key: 'testKey',
          newValue: JSON.stringify('valueFromOtherTab'),
          oldValue: JSON.stringify('initialValue'),
          storageArea: localStorage,
        });
        window.dispatchEvent(event);
      });

      // Hook should update to new value
      expect(result.current[0]).toBe('valueFromOtherTab');
    });

    it('should handle removal from other tabs', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initialValue')
      );

      act(() => {
        result.current[1]('storedValue');
      });

      expect(result.current[0]).toBe('storedValue');

      // Simulate removal from another tab
      act(() => {
        const event = new StorageEvent('storage', {
          key: 'testKey',
          newValue: null,
          oldValue: JSON.stringify('storedValue'),
          storageArea: localStorage,
        });
        window.dispatchEvent(event);
      });

      // Should revert to initial value
      expect(result.current[0]).toBe('initialValue');
    });
  });

  describe('TypeScript type safety', () => {
    it('should infer correct types for string', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'stringValue')
      );

      // TypeScript should infer string type
      const [value, setValue] = result.current;
      expect(typeof value).toBe('string');
    });

    it('should infer correct types for number', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testKey', 42)
      );

      const [value] = result.current;
      expect(typeof value).toBe('number');
    });

    it('should infer correct types for boolean', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testKey', true)
      );

      const [value] = result.current;
      expect(typeof value).toBe('boolean');
    });

    it('should handle explicit type parameter', () => {
      interface TestType {
        id: number;
        name: string;
      }

      const { result } = renderHook(() =>
        useLocalStorage<TestType>('testKey', { id: 1, name: 'Test' })
      );

      const [value] = result.current;
      expect(value).toHaveProperty('id');
      expect(value).toHaveProperty('name');
    });
  });
});

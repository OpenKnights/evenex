// util.test.ts
import { describe, expect, it, vi } from 'vitest'

import {
  isFunction,
  isObject,
  isString,
  isSymbol,
  safeExecute,
  validateEventHandler,
  validateEventType
} from '../src/util'

describe('Utility Functions', () => {
  describe('Type Checking Functions', () => {
    describe('isFunction', () => {
      it('should return true for functions', () => {
        expect(isFunction(() => {})).toBe(true)
        expect(isFunction(function () {})).toBe(true)
        expect(isFunction(async () => {})).toBe(true)
        expect(isFunction(class {})).toBe(true)
      })

      it('should return false for non-functions', () => {
        expect(isFunction('string')).toBe(false)
        expect(isFunction(123)).toBe(false)
        expect(isFunction({})).toBe(false)
        expect(isFunction(null)).toBe(false)
        expect(isFunction(undefined)).toBe(false)
      })
    })

    describe('isString', () => {
      it('should return true for strings', () => {
        expect(isString('hello')).toBe(true)
        expect(isString('')).toBe(true)
        expect(isString(String('test'))).toBe(true)
      })

      it('should return false for non-strings', () => {
        expect(isString(123)).toBe(false)
        expect(isString({})).toBe(false)
        expect(isString(null)).toBe(false)
        expect(isString(undefined)).toBe(false)
      })
    })

    describe('isSymbol', () => {
      it('should return true for symbols', () => {
        expect(isSymbol(Symbol())).toBe(true)
        expect(isSymbol(Symbol('test'))).toBe(true)
        expect(isSymbol(Symbol.for('test'))).toBe(true)
      })

      it('should return false for non-symbols', () => {
        expect(isSymbol('string')).toBe(false)
        expect(isSymbol(123)).toBe(false)
        expect(isSymbol({})).toBe(false)
      })
    })

    describe('isObject', () => {
      it('should return true for objects', () => {
        expect(isObject({})).toBe(true)
        expect(isObject([])).toBe(true)
        expect(isObject(new Date())).toBe(true)
      })

      it('should return false for non-objects', () => {
        expect(isObject(null)).toBe(false)
        expect(isObject(undefined)).toBe(false)
        expect(isObject('string')).toBe(false)
        expect(isObject(123)).toBe(false)
      })
    })
  })

  describe('Validation Functions', () => {
    describe('validateEventType', () => {
      it('should not throw for valid event types', () => {
        expect(() => validateEventType('test')).not.toThrow()
        expect(() => validateEventType(Symbol('test'))).not.toThrow()
      })

      it('should throw for invalid event types', () => {
        expect(() => validateEventType(123)).toThrow(
          'Event name must be a string or symbol'
        )
        expect(() => validateEventType({})).toThrow(
          'Event name must be a string or symbol'
        )
        expect(() => validateEventType(null)).toThrow(
          'Event name must be a string or symbol'
        )
        expect(() => validateEventType(undefined)).toThrow(
          'Event name must be a string or symbol'
        )
      })
    })

    describe('validateEventHandler', () => {
      it('should not throw for valid handlers', () => {
        expect(() => validateEventHandler(() => {})).not.toThrow()
        expect(() => validateEventHandler(function () {})).not.toThrow()
      })

      it('should throw for invalid handlers', () => {
        expect(() => validateEventHandler('string')).toThrow(
          'Event handler must be a function'
        )
        expect(() => validateEventHandler(123)).toThrow(
          'Event handler must be a function'
        )
        expect(() => validateEventHandler({})).toThrow(
          'Event handler must be a function'
        )
        expect(() => validateEventHandler(null)).toThrow(
          'Event handler must be a function'
        )
      })
    })
  })

  describe('safeExecute', () => {
    it('should execute handler with correct context and arguments', () => {
      const handler = vi.fn()
      const context = { value: 'test' }
      const args = ['arg1', 'arg2']

      safeExecute(handler, context, args)

      expect(handler).toHaveBeenCalledWith('arg1', 'arg2')
    })

    it('should call custom error handler on error', () => {
      const error = new Error('Test error')
      const handler = vi.fn(() => {
        throw error
      })
      const onError = vi.fn()

      safeExecute(handler, null, [], onError)

      expect(onError).toHaveBeenCalledWith(error)
    })

    it('should log to console when no error handler provided', () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      const error = new Error('Test error')
      const handler = vi.fn(() => {
        throw error
      })

      safeExecute(handler, null, [])

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error in event handler:',
        error
      )
      consoleErrorSpy.mockRestore()
    })

    it('should bind thisArg correctly', () => {
      const context = { value: 'test' }
      let capturedThis: any

      const handler = function (this: any) {
        // eslint-disable-next-line typescript/no-this-alias
        capturedThis = this
      }

      safeExecute(handler, context, [])

      expect(capturedThis).toBe(context)
    })

    it('should not throw when handler throws', () => {
      const handler = vi.fn(() => {
        throw new Error('Test')
      })

      expect(() => safeExecute(handler, null, [])).not.toThrow()
    })
  })
})

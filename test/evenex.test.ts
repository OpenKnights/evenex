import type { EventMap } from '../src/types'

// evenex.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createEvenex, Evenex } from '../src/evenex'

describe('Evenex', () => {
  let evenex: Evenex

  beforeEach(() => {
    evenex = new Evenex()
  })

  describe('Basic Event Handling', () => {
    it('should subscribe and emit events', () => {
      const handler = vi.fn()
      evenex.on('test', handler)
      evenex.emit('test', 'arg1', 'arg2')

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith('arg1', 'arg2')
    })

    it('should handle multiple listeners for same event', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      evenex.on('test', handler1)
      evenex.on('test', handler2)
      evenex.emit('test', 'data')

      expect(handler1).toHaveBeenCalledWith('data')
      expect(handler2).toHaveBeenCalledWith('data')
    })

    it('should support symbol event types', () => {
      const symbolEvent = Symbol('test')
      const handler = vi.fn()

      evenex.on(symbolEvent, handler)
      evenex.emit(symbolEvent, 'data')

      expect(handler).toHaveBeenCalledWith('data')
    })

    it('should return false when emitting event with no listeners', () => {
      const result = evenex.emit('nonexistent')
      expect(result).toBe(false)
    })

    it('should return true when emitting event with listeners', () => {
      evenex.on('test', () => {})
      const result = evenex.emit('test')
      expect(result).toBe(true)
    })
  })

  describe('once() Method', () => {
    it('should execute handler only once', () => {
      const handler = vi.fn()
      evenex.once('test', handler)

      evenex.emit('test', 'first')
      evenex.emit('test', 'second')

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith('first')
    })

    it('should remove once listener after execution', () => {
      const handler = vi.fn()
      evenex.once('test', handler)

      expect(evenex.listenerCount('test')).toBe(1)
      evenex.emit('test')
      expect(evenex.listenerCount('test')).toBe(0)
    })

    it('should handle multiple once listeners', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      evenex.once('test', handler1)
      evenex.once('test', handler2)
      evenex.emit('test')

      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).toHaveBeenCalledTimes(1)
      expect(evenex.listenerCount('test')).toBe(0)
    })
  })

  describe('off() Method', () => {
    it('should unsubscribe specific handler', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      evenex.on('test', handler1)
      evenex.on('test', handler2)
      evenex.off('test', handler1)
      evenex.emit('test')

      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).toHaveBeenCalled()
    })

    it('should remove all handlers when no handler specified', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      evenex.on('test', handler1)
      evenex.on('test', handler2)
      evenex.off('test')
      evenex.emit('test')

      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).not.toHaveBeenCalled()
      expect(evenex.has('test')).toBe(false)
    })

    it('should handle removing non-existent handler gracefully', () => {
      const handler = vi.fn()
      evenex.on('test', handler)

      expect(() => evenex.off('test', vi.fn())).not.toThrow()
      expect(evenex.listenerCount('test')).toBe(1)
    })

    it('should handle removing from non-existent event', () => {
      expect(() => evenex.off('nonexistent')).not.toThrow()
    })
  })

  describe('Context Binding (thisArg)', () => {
    it('should bind thisArg to handler', () => {
      const context = { value: 'test' }
      let capturedThis: any

      evenex.on(
        'test',
        function (this: any) {
          // eslint-disable-next-line typescript/no-this-alias
          capturedThis = this
        },
        context
      )

      evenex.emit('test')
      expect(capturedThis).toBe(context)
    })

    it('should work with once and thisArg', () => {
      const context = { value: 'test' }
      let capturedThis: any

      evenex.once(
        'test',
        function (this: any) {
          // eslint-disable-next-line typescript/no-this-alias
          capturedThis = this
        },
        context
      )

      evenex.emit('test')
      expect(capturedThis).toBe(context)
    })
  })

  describe('Error Handling', () => {
    it('should catch errors in handlers', () => {
      const errorHandler = vi.fn()
      const evenex = new Evenex({ onError: errorHandler })
      const error = new Error('Test error')

      evenex.on('test', () => {
        throw error
      })

      evenex.emit('test')
      expect(errorHandler).toHaveBeenCalledWith(
        error,
        'test',
        expect.any(Function)
      )
    })

    it('should continue executing other handlers after error', () => {
      const handler1 = vi.fn(() => {
        throw new Error('Error')
      })
      const handler2 = vi.fn()

      evenex.on('test', handler1)
      evenex.on('test', handler2)
      evenex.emit('test')

      expect(handler1).toHaveBeenCalled()
      expect(handler2).toHaveBeenCalled()
    })

    it('should use default error handler when none provided', () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      evenex.on('test', () => {
        throw new Error('Test error')
      })

      evenex.emit('test')
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Validation', () => {
    it('should throw error for invalid event type', () => {
      expect(() => evenex.on(123 as any, () => {})).toThrow(
        'Event name must be a string or symbol'
      )
    })

    it('should throw error for invalid handler', () => {
      expect(() => evenex.on('test', 'not a function' as any)).toThrow(
        'Event handler must be a function'
      )
    })

    it('should validate event type in all methods', () => {
      expect(() => evenex.off(123 as any)).toThrow(
        'Event name must be a string or symbol'
      )
      expect(() => evenex.emit(123 as any)).toThrow(
        'Event name must be a string or symbol'
      )
      expect(() => evenex.has(123 as any)).toThrow(
        'Event name must be a string or symbol'
      )
      expect(() => evenex.listenerCount(123 as any)).toThrow(
        'Event name must be a string or symbol'
      )
    })
  })

  describe('Utility Methods', () => {
    it('should check if event has listeners', () => {
      expect(evenex.has('test')).toBe(false)

      evenex.on('test', () => {})
      expect(evenex.has('test')).toBe(true)

      evenex.off('test')
      expect(evenex.has('test')).toBe(false)
    })

    it('should return listener count', () => {
      expect(evenex.listenerCount('test')).toBe(0)

      evenex.on('test', () => {})
      evenex.on('test', () => {})
      expect(evenex.listenerCount('test')).toBe(2)
    })

    it('should return all event names', () => {
      evenex.on('event1', () => {})
      evenex.on('event2', () => {})

      const names = evenex.eventNames()
      expect(names).toContain('event1')
      expect(names).toContain('event2')
      expect(names).toHaveLength(2)
    })

    it('should return all listeners for an event', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      evenex.on('test', handler1)
      evenex.on('test', handler2)

      const listeners = evenex.listeners('test')
      expect(listeners).toHaveLength(2)
      expect(listeners).toContain(handler1)
      expect(listeners).toContain(handler2)
    })

    it('should return empty array for non-existent event listeners', () => {
      expect(evenex.listeners('nonexistent')).toEqual([])
    })
  })

  describe('clear() Method', () => {
    it('should clear specific event', () => {
      evenex.on('event1', () => {})
      evenex.on('event2', () => {})

      evenex.clear('event1')

      expect(evenex.has('event1')).toBe(false)
      expect(evenex.has('event2')).toBe(true)
    })

    it('should clear all events', () => {
      evenex.on('event1', () => {})
      evenex.on('event2', () => {})

      evenex.clear()

      expect(evenex.eventNames()).toHaveLength(0)
    })
  })

  describe('removeAllListeners() Method', () => {
    it('should remove all listeners', () => {
      evenex.on('event1', () => {})
      evenex.on('event2', () => {})

      evenex.removeAllListeners()

      expect(evenex.eventNames()).toHaveLength(0)
    })
  })

  describe('Options', () => {
    it('should warn when max listeners exceeded', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const evenex = new Evenex({ maxListeners: 2 })

      evenex.on('test', () => {})
      evenex.on('test', () => {})
      evenex.on('test', () => {})

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Max listeners (2) exceeded')
      )

      warnSpy.mockRestore()
    })

    it('should not warn when maxListeners is 0', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const evenex = new Evenex({ maxListeners: 0 })

      for (let i = 0; i < 100; i++) {
        evenex.on('test', () => {})
      }

      expect(warnSpy).not.toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    it('should log in debug mode', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const evenex = new Evenex({ debug: true })

      evenex.on('test', () => {})
      evenex.emit('test')

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Evenex]'),
        expect.anything(),
        expect.anything()
      )

      logSpy.mockRestore()
    })
  })

  describe('Type Safety', () => {
    it('should work with typed event map', () => {
      interface MyEvents extends EventMap {
        'user:login': [userId: string, timestamp: number]
        'user:logout': []
      }

      const typedEvenex = new Evenex<MyEvents>()
      const handler = vi.fn()

      typedEvenex.on('user:login', handler)
      typedEvenex.emit('user:login', 'user123', Date.now())

      expect(handler).toHaveBeenCalledWith('user123', expect.any(Number))
    })
  })

  describe('Method Chaining', () => {
    it('should support method chaining', () => {
      const handler = vi.fn()

      const result = evenex
        .on('test1', handler)
        .on('test2', handler)
        .once('test3', handler)
        .off('test1', handler)
        .clear('test3')

      expect(result).toBe(evenex)
    })
  })

  describe('createEvenex Factory', () => {
    it('should create new instance with options', () => {
      const instance = createEvenex({ maxListeners: 5, debug: true })
      expect(instance).toBeInstanceOf(Evenex)
    })

    it('should create independent instances', () => {
      const instance1 = createEvenex()
      const instance2 = createEvenex()

      instance1.on('test', () => {})

      expect(instance1.has('test')).toBe(true)
      expect(instance2.has('test')).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle emitting with no arguments', () => {
      const handler = vi.fn()
      evenex.on('test', handler)
      evenex.emit('test')

      expect(handler).toHaveBeenCalledWith()
    })

    it('should handle removing handler during emit', () => {
      const handler1 = vi.fn(() => {
        // eslint-disable-next-line typescript/no-use-before-define
        evenex.off('test', handler2)
      })

      const handler2 = vi.fn()

      evenex.on('test', handler1)
      evenex.on('test', handler2)
      evenex.emit('test')

      expect(handler1).toHaveBeenCalled()
      expect(handler2).toHaveBeenCalled()
    })

    it('should handle adding handler during emit', () => {
      const handler2 = vi.fn()
      const handler1 = vi.fn(() => {
        evenex.on('test', handler2)
      })

      evenex.on('test', handler1)
      evenex.emit('test')
      evenex.emit('test')

      expect(handler1).toHaveBeenCalledTimes(2)
      expect(handler2).toHaveBeenCalledTimes(1)
    })

    it('should handle same handler added multiple times', () => {
      const handler = vi.fn()

      evenex.on('test', handler)
      evenex.on('test', handler)
      evenex.emit('test')

      expect(handler).toHaveBeenCalledTimes(2)
    })

    it('should clean up event when all handlers removed', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      evenex.on('test', handler1)
      evenex.on('test', handler2)
      evenex.off('test', handler1)
      evenex.off('test', handler2)

      expect(evenex.has('test')).toBe(false)
      expect(evenex.eventNames()).not.toContain('test')
    })
  })
})

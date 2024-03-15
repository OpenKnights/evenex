import { THandles, IEvents, THandler } from './types'

const boundary = (
  type: string,
  handler: THandler | null,
  handles: THandles,
  { checkHandle = true }: { checkHandle?: boolean } = {}
) => {
  if (typeof type !== 'string') {
    throw new TypeError('the event name must be string type')
  }

  if (checkHandle) {
    if (typeof handler !== 'function')
      throw new TypeError('the event callback must be function type')
  }

  return Array.isArray(handles)
}

class Evenex {
  private events: IEvents
  constructor() {
    this.events = {}
  }

  on(type: string, handler: THandler, thisArg?: any) {
    let handles = this.events[type]
    const isVerify = boundary(type, handler, handles)
    if (!isVerify) {
      handles = []
      this.events[type] = handles
    }
    handles.push({
      handler,
      thisArg
    })
  }

  off(type: string, handler: THandler) {
    const handles = this.events[type]
    const isVerify = boundary(type, handler, handles)
    if (!isVerify) return

    if (!handler || handles.length === 0) {
      delete this.events[type]
    } else {
      for (let i = 0; i < handles.length; i++) {
        const currHandler = handles[i].handler
        if (currHandler === handler) {
          handles.splice(i, 1)
          break
        }
      }

      if (handles.length === 0) delete this.events[type]
    }
  }

  emit(type: string, ...payload: any[]) {
    const handles = this.events[type]
    const isVerify = boundary(type, null, handles, {
      checkHandle: false
    })
    if (!isVerify) return

    handles.forEach(({ handler, thisArg }) => {
      handler.apply(thisArg, payload)
    })
  }

  clear() {
    this.events = {}
  }

  has(type: string) {
    return Object.keys(this.events).includes(type)
  }
}

const CreateEvenex = () => new Evenex()
export { CreateEvenex }

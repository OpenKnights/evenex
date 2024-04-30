import type { IEvents, THandler } from '../types'
import { boundary } from './util'

export class Evenex {
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

    for (let i = 0; i < handles.length; i++) {
      const currHandle = handles[i].handler
      if (currHandle === handler) {
        handles.splice(i, 1)
        break
      }
    }

    if (handles.length === 0) delete this.events[type]
  }

  emit(type: string, ...payload: any[]) {
    const handles = this.events[type]
    const isVerify = boundary(type, null, handles, false)
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

const createEvenex = () => new Evenex()
const evenex = createEvenex()

export { createEvenex }
export default evenex

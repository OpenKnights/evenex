export interface IHandle {
  handler: (...args: any[]) => any
  thisArg: any
}

export interface IEvents {
  [key: string]: IHandle[]
}

export type TCallback = (...args: any[]) => any

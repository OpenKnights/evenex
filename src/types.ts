export type THandles = Array<{
  handler: (...args: any[]) => any
  thisArg: any
}>

export interface IEvents {
  [key: string]: THandles
}

export type THandler = (...args: any[]) => any

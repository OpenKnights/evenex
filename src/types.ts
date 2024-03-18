export type THandler = (...payload: any[]) => any

type THandle = {
  handler: THandler
  thisArg: any
}

export type THandles = Array<THandle>

export interface IEvents {
  [key: string]: THandles
}

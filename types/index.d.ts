//! Handle types
export type THandler = (...payload: any[]) => void

type THandle = {
  handler: THandler
  thisArg: any
}

export type THandles = Array<THandle>

//! Event types
export interface IEvents {
  [key: string]: THandles
}

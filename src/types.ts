export type THandler = (...payload: any[]) => any

export type THandles = Array<{
  handler: THandler
  thisArg: any
}>

export interface IEvents {
  [key: string]: THandles
}

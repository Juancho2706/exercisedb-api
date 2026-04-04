/* eslint-disable @typescript-eslint/no-explicit-any */
interface Obj {
  [key: string]: any
}

export interface IUseCase<T extends Obj | string | void = any, TRes = any> {
  execute: (_params: T) => Promise<TRes>
}

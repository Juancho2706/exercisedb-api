export interface RedisRepositoryInterface {
  get(_prefix: string, _key: string): Promise<string | null>
  set(_prefix: string, _key: string, _value: string): Promise<void>
  delete(_prefix: string, _key: string): Promise<void>
  setWithExpiry(_prefix: string, _key: string, _value: string, _expiry: number): Promise<void>
}

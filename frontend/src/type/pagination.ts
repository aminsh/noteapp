export type PageableRequest<TExtra = object> = {
  request: {
    take: number
    skip: number
  } & TExtra
}

export type PageableResponse<TKey extends string, TData> = {
  [key in TKey]: {
    data: TData[]
    count: number
  }
}
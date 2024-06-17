import { File } from './entity'

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

export type Page = {
  pageSize: number
  page: number
  total: number
}

export type GoogleDrivePageableResponse = {
  googleDriveFind: {
    data: File[]
    nextPageToken: string
  }
}
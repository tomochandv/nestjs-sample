export interface ICreateSubscribe {
  studentIdx: number
  pageIdx: number
}

export interface IListSubscribe {
  studentIdx: number
  page: number
  rows: number
}

export interface IListNewsByPageIdx {
  studentIdx: number
  pageIdx: number
  page: number
  rows: number
}

export interface IAllListNews {
  studentIdx: number
  page: number
  rows: number
}

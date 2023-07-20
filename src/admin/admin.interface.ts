export interface ICreatePageInfo {
  region: string
  name: string
}

export interface IListPageInfo {
  page: number
  rows: number
}

export interface ICreateNotice {
  idx: number
  contents: string
}

export interface INoticeIdx {
  idx: number
}

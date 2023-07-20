import { ApiProperty } from '@nestjs/swagger'

export class SubscribeNewsListModel {
  @ApiProperty({ description: '총 갯수' })
  total: number

  @ApiProperty({ description: '리스트' })
  list: Array<SubscribeNewsProperty>
}

export class SubscribeNewsProperty {
  @ApiProperty({ description: '뉴스 아이디' })
  newsIdx: number
  @ApiProperty({ description: '학교페이지 아이디' })
  pageIdx: number
  @ApiProperty({ description: '지역' })
  region: string
  @ApiProperty({ description: '학교명' })
  schoolName: string
  @ApiProperty({ description: '내용' })
  contents: string
  @ApiProperty({ description: '날짜' })
  createAt: Date
}

import { ApiProperty } from '@nestjs/swagger'

export class SubscribeListModel {
  @ApiProperty({ description: '총 갯수' })
  total: number

  @ApiProperty({ description: '리스트' })
  list: Array<SubscribeProperty>
}

export class SubscribeProperty {
  @ApiProperty({ description: '구독아이디' })
  subscribeIdx: number
  @ApiProperty({ description: '학생아이디' })
  studentIdx: number
  @ApiProperty({ description: '학교페이지 아이디' })
  pageIdx: number
  @ApiProperty({ description: '지역' })
  region: string
  @ApiProperty({ description: '학교명' })
  schoolName: string
}

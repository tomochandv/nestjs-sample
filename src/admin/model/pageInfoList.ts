import { ApiProperty } from '@nestjs/swagger'
import { PageInfoEntity } from '../../entities/pageInfo.entity'

export class PageInfoListModel {
  @ApiProperty({ description: '총 갯수' })
  total: number

  @ApiProperty({ description: '리스트' })
  list: Array<PageInfoEntity>
}

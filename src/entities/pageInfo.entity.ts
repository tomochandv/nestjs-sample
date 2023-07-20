import { ApiProperty } from '@nestjs/swagger'
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { NoticeEntity } from './notice.entity'
import { SubscribeEntity } from './subscribe.entity'

/**
 * 학교 페이지
 */
@Entity('page_info')
export class PageInfoEntity {
  @ApiProperty({ description: '아이디' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'page_idx', comment: '페이지 아이디' })
  idx: number

  @Index()
  @ApiProperty({ description: '지역' })
  @Column('varchar', { name: 'region', comment: '지역', length: 20 })
  region: string

  @Index()
  @ApiProperty({ description: '학교명' })
  @Column('varchar', { name: 'sc_name', comment: '학교명', length: 100 })
  schoolName: string

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date

  @OneToMany(() => NoticeEntity, (notice) => notice.pageIdx)
  notice: NoticeEntity[]

  @OneToMany(() => SubscribeEntity, (subscribe) => subscribe.pageIdx)
  subscribe: SubscribeEntity[]
}

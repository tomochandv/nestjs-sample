import { ApiProperty } from '@nestjs/swagger'
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { PageInfoEntity } from './pageInfo.entity'
import { NoticeEntity } from './notice.entity'

/**
 * 학교 페이지 구독
 */
@Entity('subscribe')
export class SubscribeEntity {
  @ApiProperty({ description: '아이디' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'subs_idx', comment: '구독 아이디' })
  idx: number

  @Column('int', { name: 'page_idx', comment: '페이지 아이디' })
  pageIdx: number

  @Index()
  @Column('int', { name: 'stu_idx', comment: '학생 아이디' })
  studentIdx: number

  @Column('varchar', { name: 'is_use', comment: '구독여부', length: 1 })
  isUse: string

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date

  @ApiProperty({ description: '구독 취소일' })
  @Column({ name: 'delete_at', comment: '구독 취소일', nullable: true })
  deletedAt: Date

  @ManyToOne(() => PageInfoEntity, (pageInfo) => pageInfo.idx)
  @JoinColumn({ name: 'page_idx' })
  pageInfo: PageInfoEntity
}

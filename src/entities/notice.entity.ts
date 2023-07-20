import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { PageInfoEntity } from './pageInfo.entity'
import { SubscribeEntity } from './subscribe.entity'

/**
 * 학교 페이지 소식
 */
@Entity('notice_info')
export class NoticeEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'notice_idx', comment: '페이지 소식 아이디' })
  idx: number

  @Column('int', { name: 'page_idx', comment: '페이지 아이디' })
  pageIdx: number

  @Column('text', { name: 'contents', comment: '내용' })
  contents: string

  @Column('varchar', { name: 'is_use', comment: '사용여부', length: 1 })
  isUse: string

  @Column('datetime', {
    name: 'created_at',
    comment: '생성일',
  })
  createdAt: Date

  @ManyToOne(() => PageInfoEntity, (pageInfo) => pageInfo.idx)
  @JoinColumn({ name: 'page_idx' })
  pageInfo: PageInfoEntity
}

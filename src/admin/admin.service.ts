import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PageInfoEntity } from '../entities/pageInfo.entity'
import { NoticeEntity } from '../entities/notice.entity'
import { ICreateNotice, ICreatePageInfo, IListPageInfo, INoticeIdx } from './admin.interface'
import { PageInfoListModel } from './model/pageInfoList'

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(PageInfoEntity)
    private pageInfoRepository: Repository<PageInfoEntity>,
    @InjectRepository(NoticeEntity)
    private noticeRepository: Repository<NoticeEntity>
  ) {}

  /**
   * 학교 페이지 저장
   * @param params ICreatePageInfo
   * @returns boolean
   */
  async addPageInfo(params: ICreatePageInfo): Promise<boolean> {
    try {
      const duplicated = await this.pageInfoRepository.countBy({
        region: params.region,
        schoolName: params.name,
      })
      if (duplicated > 0) {
        throw new HttpException('중복된 지역,학교 입니다.', 402)
      }
      const result = await this.pageInfoRepository.save({
        region: params.region,
        schoolName: params.name,
      })
      return result.idx > 0
    } catch (err) {
      throw err
    }
  }

  /**
   * 학교 페이지 리스트
   * @param params IListPageInfo
   * @returns PageInfoListModel
   */
  async getPageInfoList(params: IListPageInfo): Promise<PageInfoListModel> {
    try {
      const start = (params.page - 1) * params.rows
      const [list, total] = await this.pageInfoRepository.findAndCount({
        order: {
          idx: 'desc',
        },
        skip: start,
        take: params.rows,
      })
      return {
        total,
        list,
      }
    } catch (err) {
      throw err
    }
  }

  /**
   * 소식 저장
   * @param params ICreateNotice
   * @returns boolean
   */
  async addNotice(params: ICreateNotice): Promise<boolean> {
    try {
      const result = await this.noticeRepository.save({
        pageIdx: params.idx,
        contents: params.contents,
        isUse: 'Y',
        createdAt: new Date(),
      })
      return result.idx > 0
    } catch (err) {
      throw err
    }
  }
  /**
   * 소식 삭제
   * @param params
   * @returns
   */
  async removeNotice(params: INoticeIdx): Promise<boolean> {
    try {
      const result = await this.noticeRepository.update({ idx: params.idx }, { isUse: 'N' })
      return result.affected > 0
    } catch (err) {
      throw err
    }
  }

  /**
   * 소식 업데이트
   * @param params ICreateNotice
   * @returns boolean
   */
  async updateNotice(params: ICreateNotice): Promise<boolean> {
    try {
      const result = await this.noticeRepository.update({ idx: params.idx }, { contents: params.contents })
      return result.affected > 0
    } catch (err) {
      throw err
    }
  }
}

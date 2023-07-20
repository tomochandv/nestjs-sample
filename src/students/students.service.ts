import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SubscribeEntity } from '../entities/subscribe.entity'
import { In, Repository } from 'typeorm'
import { NoticeEntity } from '../entities/notice.entity'
import { PageInfoEntity } from '../entities/pageInfo.entity'
import { SubscribeListModel } from './model/subscribeList.model'
import { SubscribeNewsListModel } from './model/subscribeNewsList.model'
import { IAllListNews, ICreateSubscribe, IListNewsByPageIdx, IListSubscribe } from './students.interface'

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(PageInfoEntity)
    private pageInfoRepository: Repository<PageInfoEntity>,
    @InjectRepository(NoticeEntity)
    private noticeRepository: Repository<NoticeEntity>,
    @InjectRepository(SubscribeEntity)
    private subscribeRepository: Repository<SubscribeEntity>
  ) {}

  /**
   * 구독저장
   * @param param ICreateSubscribe
   * @returns boolean
   */
  async addSubscribe(param: ICreateSubscribe): Promise<boolean> {
    try {
      const duplicated = await this.subscribeRepository.countBy({
        studentIdx: param.studentIdx,
        pageIdx: param.pageIdx,
      })
      if (duplicated > 0) {
        throw new HttpException('이미 구독 하였습니다.', 401)
      } else {
        const result = await this.subscribeRepository.save({
          pageIdx: param.pageIdx,
          studentIdx: param.studentIdx,
          isUse: 'Y',
          createdAt: new Date().toISOString(),
        })
        return result.idx > 0
      }
    } catch (err) {
      throw err
    }
  }

  /**
   * 구독 취소
   * @param idx 구독아이디
   * @returns
   */
  async removeSubscribe(idx: number): Promise<boolean> {
    try {
      const result = await this.subscribeRepository.update({ idx }, { isUse: 'N', deletedAt: new Date().toISOString() })
      return result.affected > 0
    } catch (err) {
      throw err
    }
  }

  /**
   * 구독 리스트
   * @param params IListSubscribe
   * @returns SubscribeListModel
   */
  async getSubscribeList(params: IListSubscribe): Promise<SubscribeListModel> {
    try {
      const start = (params.page - 1) * params.rows
      const [list, total] = await this.subscribeRepository.findAndCount({
        relations: {
          pageInfo: true,
        },
        where: {
          studentIdx: params.studentIdx,
          isUse: 'Y',
        },
        order: {
          idx: 'desc',
        },
        skip: start,
        take: params.rows,
      })
      const model = new SubscribeListModel()
      model.total = total
      model.list =
        list.length > 0
          ? list.map((x) => {
              return {
                studentIdx: x.studentIdx,
                pageIdx: x.pageIdx,
                region: x.pageInfo.region,
                schoolName: x.pageInfo.schoolName,
                subscribeIdx: x.idx,
              }
            })
          : []
      return model
    } catch (err) {
      throw err
    }
  }

  /**
   * 구독한 학교페이지별 뉴스 리스트
   * @param params IListNewsByPageIdx
   * @returns SubscribeNewsListModel
   */
  async getNewsListByPageIdx(params: IListNewsByPageIdx): Promise<SubscribeNewsListModel> {
    try {
      const start = (params.page - 1) * params.rows
      const [list, total] = await this.noticeRepository.findAndCount({
        relations: {
          pageInfo: true,
        },
        where: {
          isUse: 'Y',
          pageIdx: params.pageIdx,
        },
        order: {
          createdAt: 'DESC',
        },
        skip: start,
        take: params.rows,
      })

      const model = new SubscribeNewsListModel()
      model.total = total
      model.list = list.map((x) => {
        return {
          region: x.pageInfo.region,
          schoolName: x.pageInfo.schoolName,
          pageIdx: x.pageIdx,
          newsIdx: x.idx,
          contents: x.contents,
          createAt: x.createdAt,
        }
      })
      return model
    } catch (err) {
      throw err
    }
  }

  /**
   * 구독한 학교페이지의 모든 소식
   * @param params
   * @returns
   */
  async getAllNewsList(params: IAllListNews): Promise<SubscribeNewsListModel> {
    try {
      const start = (params.page - 1) * params.rows
      const subscribeIdxs = await this.subscribeList(params.studentIdx)

      const model = new SubscribeNewsListModel()
      if (subscribeIdxs.length > 0) {
        const [list, total] = await this.noticeRepository.findAndCount({
          relations: {
            pageInfo: true,
          },
          where: {
            isUse: 'Y',
            pageIdx: In(subscribeIdxs),
          },
          order: {
            createdAt: 'DESC',
          },
          skip: start,
          take: params.rows,
        })

        model.total = total
        model.list = list.map((x) => {
          return {
            region: x.pageInfo.region,
            schoolName: x.pageInfo.schoolName,
            pageIdx: x.pageIdx,
            newsIdx: x.idx,
            contents: x.contents,
            createAt: x.createdAt,
          }
        })
      } else {
        model.list = []
        model.total = 0
      }
      return model
    } catch (err) {
      throw err
    }
  }

  /**
   * 구독 이후의 구독한 모든 게시물 보기
   * @param params IAllListNews
   * @returns SubscribeNewsListModel
   */
  async getAllNewsListLts(params: IAllListNews): Promise<SubscribeNewsListModel> {
    try {
      const start = (params.page - 1) * params.rows
      const subscribeIdxs = await this.subscribeList(params.studentIdx)
      const model = new SubscribeNewsListModel()
      if (subscribeIdxs.length > 0) {
        const list = await this.noticeRepository
          .query(`SELECT a.notice_idx as noticeIdx, a.page_idx as pageIdx , a.contents, a.created_at as createAt, c.region ,c.sc_name as schoolName
        from notice_info a 
        inner join subscribe b on a.page_idx  = b.page_idx
        inner join page_info c on a.page_idx  = c.page_idx and b.page_idx  = c.page_idx 
        where a.created_at <= b.create_at 
        and b.stu_idx = ${params.studentIdx} and b.is_use = 'Y'
        order by a.created_at desc
        limit ${start}, ${params.rows}
        `)

        const total = await this.noticeRepository.query(`SELECT count(1) as total from notice_info a 
        inner join subscribe b on a.page_idx  = b.page_idx
        inner join page_info c on a.page_idx  = c.page_idx and b.page_idx  = c.page_idx 
        where a.created_at <= b.create_at 
        and b.stu_idx = ${params.studentIdx} and b.is_use = 'Y'`)

        model.total = Number(total[0].total)
        model.list = list.map((x) => {
          return {
            region: x.region,
            schoolName: x.schoolName,
            pageIdx: x.pageIdx,
            newsIdx: x.noticeIdx,
            contents: x.contents,
            createAt: x.createAt,
          }
        })
      } else {
        model.list = []
        model.total = 0
      }
      return model
    } catch (err) {
      throw err
    }
  }

  /**
   * 구독 취소후, 취소전 구독 리스트도 보이게
   * @param params IAllListNews
   * @returns SubscribeNewsListModel
   */
  async getAllNewsListUns(params: IAllListNews): Promise<SubscribeNewsListModel> {
    try {
      const start = (params.page - 1) * params.rows
      const subscribeIdxs = await this.subscribeList(params.studentIdx)
      const model = new SubscribeNewsListModel()
      if (subscribeIdxs.length > 0) {
        const list = await this.noticeRepository
          .query(`SELECT a.notice_idx as noticeIdx, a.page_idx as pageIdx , a.contents, a.created_at as createAt, c.region ,c.sc_name as schoolName
          from notice_info a 
          inner join subscribe b on a.page_idx  = b.page_idx
          inner join page_info c on a.page_idx  = c.page_idx and b.page_idx  = c.page_idx 
          where b.stu_idx = ${params.studentIdx}
          and ((b.is_use = 'N' and a.created_at BETWEEN b.create_at and b.delete_at) or b.is_use = 'Y')
          order by a.created_at desc 
          limit ${start}, ${params.rows}
        `)

        const total = await this.noticeRepository.query(`SELECT count(1) as total           
        from notice_info a 
        inner join subscribe b on a.page_idx  = b.page_idx
        inner join page_info c on a.page_idx  = c.page_idx and b.page_idx  = c.page_idx 
        where b.stu_idx = ${params.studentIdx}
        and ((b.is_use = 'N' and a.created_at BETWEEN b.create_at and b.delete_at) or b.is_use = 'Y')`)

        model.total = Number(total[0].total)
        model.list = list.map((x) => {
          return {
            region: x.region,
            schoolName: x.schoolName,
            pageIdx: x.pageIdx,
            newsIdx: x.noticeIdx,
            contents: x.contents,
            createAt: x.createAt,
          }
        })
      } else {
        model.list = []
        model.total = 0
      }
      return model
    } catch (err) {
      throw err
    }
  }

  private async subscribeList(studentIdx: number): Promise<Array<number>> {
    try {
      const subscribeInfos = await this.subscribeRepository.find({
        where: {
          isUse: 'Y',
          studentIdx: studentIdx,
        },
      })
      const subscribeIdxs = subscribeInfos.map((x) => {
        return x.pageIdx
      })
      return subscribeIdxs
    } catch (err) {
      throw err
    }
  }
}

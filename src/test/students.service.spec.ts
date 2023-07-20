import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { StudentService } from '../students/students.service'
import { NoticeEntity } from '../entities/notice.entity'
import { PageInfoEntity } from '../entities/pageInfo.entity'
import { SubscribeEntity } from '../entities/subscribe.entity'
import { Repository } from 'typeorm'

const mockPostRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  save: jest.fn(),
  countBy: jest.fn(),
  update: jest.fn(),
  query: jest.fn().mockReturnThis(),
})

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>

describe('Admin Service Test', () => {
  let pageInfoRepository: MockRepository<PageInfoEntity>
  let noticeRepository: MockRepository<NoticeEntity>
  let subscribeRepository: MockRepository<SubscribeEntity>
  let service: StudentService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getRepositoryToken(PageInfoEntity),
          useValue: mockPostRepository(),
        },
        {
          provide: getRepositoryToken(NoticeEntity),
          useValue: mockPostRepository(),
        },
        {
          provide: getRepositoryToken(SubscribeEntity),
          useValue: mockPostRepository(),
        },
      ],
    }).compile()

    service = module.get<StudentService>(StudentService)
    pageInfoRepository = module.get<MockRepository<PageInfoEntity>>(getRepositoryToken(PageInfoEntity))
    noticeRepository = module.get<MockRepository<NoticeEntity>>(getRepositoryToken(NoticeEntity))
    subscribeRepository = module.get<MockRepository<SubscribeEntity>>(getRepositoryToken(SubscribeEntity))
  })

  afterEach(() => {
    subscribeRepository.save.mockClear()
    subscribeRepository.find.mockClear()
    subscribeRepository.countBy.mockClear()
    subscribeRepository.update.mockClear()
    noticeRepository.findAndCount.mockClear()
    noticeRepository.query.mockClear()
  })

  it('서비스를 정의 합니다.', () => {
    expect(service).toBeDefined()
  })

  it('addSubscribe - success', async () => {
    subscribeRepository.countBy.mockResolvedValue(0)
    subscribeRepository.save.mockResolvedValue({ idx: 1 })
    const result = await service.addSubscribe({ pageIdx: 1, studentIdx: 1 })
    expect(subscribeRepository.countBy).toHaveBeenCalledTimes(1)
    expect(subscribeRepository.save).toHaveBeenCalledTimes(1)
    expect(result).toEqual(true)
  })

  it('addSubscribe - false', async () => {
    subscribeRepository.countBy.mockResolvedValue(1)
    subscribeRepository.save.mockResolvedValue({ idx: 0 })
    await service
      .addSubscribe({
        pageIdx: 1,
        studentIdx: 1,
      })
      .catch((err) => {
        expect(err.message).toBe('이미 구독 하였습니다.')
      })
  })

  it('removeSubscribe - success', async () => {
    subscribeRepository.update.mockResolvedValue({ affected: 1 })
    const result = await service.removeSubscribe(1)
    expect(subscribeRepository.update).toHaveBeenCalledTimes(1)
    expect(result).toEqual(true)
  })

  it('getSubscribeList - success', async () => {
    const date = new Date()
    subscribeRepository.findAndCount.mockResolvedValue([
      [
        {
          idx: 2,
          pageIdx: 2,
          studentIdx: 1,
          isUse: 'Y',
          createdAt: date,
          deletedAt: null,
          pageInfo: {
            idx: 2,
            region: '서울2',
            schoolName: '학교명',
            createdAt: '2023-07-20T01:37:24.186Z',
          },
        },
      ],
      2,
    ])
    const result = await service.getSubscribeList({ page: 1, rows: 10, studentIdx: 1 })
    expect(subscribeRepository.findAndCount).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      total: 2,
      list: [
        {
          subscribeIdx: 2,
          pageIdx: 2,
          studentIdx: 1,
          region: '서울2',
          schoolName: '학교명',
        },
      ],
    })
  })

  it('getNewsListByPageIdx - success', async () => {
    const date = new Date()
    noticeRepository.findAndCount.mockResolvedValue([
      [
        {
          idx: 1,
          pageIdx: 1,
          contents: '소식',
          isUse: 'Y',
          createdAt: date,
          pageInfo: {
            idx: 1,
            region: '서울',
            schoolName: '학교명',
            createdAt: date,
          },
        },
      ],
      1,
    ])
    const result = await service.getNewsListByPageIdx({ page: 1, rows: 10, studentIdx: 1, pageIdx: 1 })
    expect(noticeRepository.findAndCount).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      total: 1,
      list: [
        {
          region: '서울',
          schoolName: '학교명',
          pageIdx: 1,
          newsIdx: 1,
          contents: '소식',
          createAt: date,
        },
      ],
    })
  })

  it('getAllNewsList - success', async () => {
    const date = new Date()
    subscribeRepository.find.mockResolvedValue([{ pageIdx: 1 }])
    noticeRepository.findAndCount.mockResolvedValue([
      [
        {
          idx: 1,
          pageIdx: 1,
          contents: '소식',
          isUse: 'Y',
          createdAt: date,
          pageInfo: {
            idx: 1,
            region: '서울',
            schoolName: '학교명',
            createdAt: date,
          },
        },
      ],
      1,
    ])
    const result = await service.getAllNewsList({ page: 1, rows: 10, studentIdx: 1 })
    expect(subscribeRepository.find).toHaveBeenCalledTimes(1)
    expect(noticeRepository.findAndCount).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      total: 1,
      list: [
        {
          region: '서울',
          schoolName: '학교명',
          pageIdx: 1,
          newsIdx: 1,
          contents: '소식',
          createAt: date,
        },
      ],
    })
  })

  it('getAllNewsListLts - success', async () => {
    const date = new Date()
    subscribeRepository.find.mockResolvedValue([{ pageIdx: 1 }])
    noticeRepository.query.mockResolvedValueOnce([
      {
        noticeIdx: 1,
        pageIdx: 1,
        contents: '소식',
        isUse: 'Y',
        createAt: date,
        region: '서울',
        schoolName: '학교명',
      },
    ])
    noticeRepository.query.mockResolvedValueOnce([
      {
        total: 1,
      },
    ])
    const result = await service.getAllNewsListLts({ page: 1, rows: 10, studentIdx: 1 })
    expect(subscribeRepository.find).toHaveBeenCalledTimes(1)
    expect(noticeRepository.query).toHaveBeenCalledTimes(2)
    expect(result).toEqual({
      total: 1,
      list: [
        {
          region: '서울',
          schoolName: '학교명',
          pageIdx: 1,
          newsIdx: 1,
          contents: '소식',
          createAt: date,
        },
      ],
    })
  })

  it('getAllNewsListUns - success', async () => {
    const date = new Date()
    subscribeRepository.find.mockResolvedValue([{ pageIdx: 1 }])
    noticeRepository.query.mockResolvedValueOnce([
      {
        noticeIdx: 1,
        pageIdx: 1,
        contents: '소식',
        isUse: 'Y',
        createAt: date,
        region: '서울',
        schoolName: '학교명',
      },
    ])
    noticeRepository.query.mockResolvedValueOnce([
      {
        total: 1,
      },
    ])
    const result = await service.getAllNewsListUns({ page: 1, rows: 10, studentIdx: 1 })
    expect(subscribeRepository.find).toHaveBeenCalledTimes(1)
    expect(noticeRepository.query).toHaveBeenCalledTimes(2)
    expect(result).toEqual({
      total: 1,
      list: [
        {
          region: '서울',
          schoolName: '학교명',
          pageIdx: 1,
          newsIdx: 1,
          contents: '소식',
          createAt: date,
        },
      ],
    })
  })
})

import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AdminService } from '../admin/admin.service'
import { NoticeEntity } from '../entities/notice.entity'
import { PageInfoEntity } from '../entities/pageInfo.entity'
import { Repository } from 'typeorm'

const mockPostRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  save: jest.fn(),
  countBy: jest.fn(),
  update: jest.fn(),
})

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>

describe('Admin Service Test', () => {
  let pageInfoRepository: MockRepository<PageInfoEntity>
  let noticeRepository: MockRepository<NoticeEntity>
  let service: AdminService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(PageInfoEntity),
          useValue: mockPostRepository(),
        },
        {
          provide: getRepositoryToken(NoticeEntity),
          useValue: mockPostRepository(),
        },
      ],
    }).compile()

    service = module.get<AdminService>(AdminService)
    pageInfoRepository = module.get<MockRepository<PageInfoEntity>>(getRepositoryToken(PageInfoEntity))
    noticeRepository = module.get<MockRepository<NoticeEntity>>(getRepositoryToken(NoticeEntity))
  })

  afterEach(() => {
    pageInfoRepository.save.mockClear()
    pageInfoRepository.countBy.mockClear()
    noticeRepository.save.mockClear()
    noticeRepository.update.mockClear()
  })

  it('서비스를 정의 합니다.', () => {
    expect(service).toBeDefined()
  })

  it('addPageInfo - success', async () => {
    pageInfoRepository.countBy.mockResolvedValue(0)
    pageInfoRepository.save.mockResolvedValue({ idx: 1 })
    const result = await service.addPageInfo({ region: '방배동', name: '우리학교' })
    expect(pageInfoRepository.countBy).toHaveBeenCalledTimes(1)
    expect(pageInfoRepository.save).toHaveBeenCalledTimes(1)
    expect(result).toEqual(true)
  })

  it('addPageInfo - false', async () => {
    pageInfoRepository.countBy.mockResolvedValue(1)
    pageInfoRepository.save.mockResolvedValue({ idx: 0 })
    await service
      .addPageInfo({
        region: '',
        name: '우리학교',
      })
      .catch((err) => {
        expect(err.message).toBe('중복된 지역,학교 입니다.')
      })
  })

  it('addPageInfo - false', async () => {
    pageInfoRepository.countBy.mockResolvedValue(0)
    pageInfoRepository.save.mockResolvedValue({ idx: 0 })
    const result = await service.addPageInfo({
      region: '',
      name: '우리학교',
    })
    expect(pageInfoRepository.countBy).toHaveBeenCalledTimes(1)
    expect(pageInfoRepository.save).toHaveBeenCalledTimes(1)
    expect(result).toEqual(false)
  })

  it('getPageInfoList - success', async () => {
    const date = new Date().toISOString()
    pageInfoRepository.findAndCount.mockResolvedValue([[{ idx: 1, region: '서울2', schoolName: '학교명2', createdAt: date }], 1])
    const result = await service.getPageInfoList({ page: 1, rows: 10 })
    expect(pageInfoRepository.findAndCount).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      total: 1,
      list: [
        {
          idx: 1,
          region: '서울2',
          schoolName: '학교명2',
          createdAt: date,
        },
      ],
    })
  })

  it('addNotice - success', async () => {
    noticeRepository.save.mockResolvedValue({ idx: 1 })
    const result = await service.addNotice({ idx: 1, contents: 'notice' })
    expect(noticeRepository.save).toHaveBeenCalledTimes(1)
    expect(result).toEqual(true)
  })

  it('removeNotice - success', async () => {
    noticeRepository.update.mockResolvedValue({ affected: 1 })
    const result = await service.removeNotice({ idx: 1 })
    expect(noticeRepository.update).toHaveBeenCalledTimes(1)
    expect(result).toEqual(true)
  })

  it('updateNotice - success', async () => {
    noticeRepository.update.mockResolvedValue({ affected: 1 })
    const result = await service.updateNotice({ idx: 1, contents: 'dd' })
    expect(noticeRepository.update).toHaveBeenCalledTimes(1)
    expect(result).toEqual(true)
  })
})

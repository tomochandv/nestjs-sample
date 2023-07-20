import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SubscribeListModel } from './model/subscribeList.model'
import { AddSubscribeDto, GetAllNewsListDto, GetNewsListDto, GetSubscribeListDto, RemoveSubscribeDto } from './students.dto'
import { StudentService } from './students.service'
import { SubscribeNewsListModel } from './model/subscribeNewsList.model'

@ApiTags('Students')
@Controller()
export class StudentControll {
  constructor(private readonly studentService: StudentService) {}

  @ApiOperation({ summary: '학교페이지 구독', description: '학교페이지 구독' })
  @ApiResponse({
    status: 201,
    description: 'bool 타입으로 성공 여부 체크',
  })
  @ApiResponse({
    status: 400,
    description: '파라미터 유효성 맞지 않음',
  })
  @ApiResponse({
    status: 401,
    description: '이미 구독된 페이지 입니다.',
  })
  @Post('student/subscribe')
  async addSubscribe(@Body() dto: AddSubscribeDto): Promise<boolean> {
    const info = await this.studentService.addSubscribe(dto)
    return info
  }

  @ApiOperation({ summary: '학교 페이지 구독 리스트', description: '학교 페이지 구독 리스트를 가져옵니다' })
  @ApiResponse({
    status: 200,
    description: '총갯수와 리스트',
    type: SubscribeListModel,
  })
  @ApiResponse({
    status: 400,
    description: '파라미터 유효성 맞지 않음',
  })
  @Get('student/subscribe')
  async getSubscribeList(@Query() dto: GetSubscribeListDto): Promise<SubscribeListModel> {
    const info = await this.studentService.getSubscribeList(dto)
    return info
  }

  @ApiOperation({ summary: '학교페이지 구독 취소', description: '학교페이지 구독 취소' })
  @ApiResponse({
    status: 201,
    description: 'bool 타입으로 성공 여부 체크',
  })
  @ApiResponse({
    status: 400,
    description: '파라미터 유효성 맞지 않음',
  })
  @Delete('student/subscribe')
  async removeSubscribe(@Query() dto: RemoveSubscribeDto): Promise<boolean> {
    const info = await this.studentService.removeSubscribe(dto.idx)
    return info
  }

  @ApiOperation({ summary: '소식 리스트 - 학교페이지별', description: '소식 리스트 - 학교페이지별' })
  @ApiResponse({
    status: 200,
    description: '총갯수와 리스트',
    type: SubscribeNewsListModel,
  })
  @ApiResponse({
    status: 400,
    description: '파라미터 유효성 맞지 않음',
  })
  @Get('student/news')
  async getNewsListByPageIdx(@Query() dto: GetNewsListDto): Promise<SubscribeNewsListModel> {
    const info = await this.studentService.getNewsListByPageIdx(dto)
    return info
  }

  @ApiOperation({ summary: '소식 리스트 - 모두 구독한 리스트', description: '소식 리스트 - 모두 구독한 리스트' })
  @ApiResponse({
    status: 200,
    description: '총갯수와 리스트',
    type: SubscribeNewsListModel,
  })
  @ApiResponse({
    status: 400,
    description: '파라미터 유효성 맞지 않음',
  })
  @Get('student/news/all')
  async getAllNewsList(@Query() dto: GetAllNewsListDto): Promise<SubscribeNewsListModel> {
    const info = await this.studentService.getAllNewsList(dto)
    return info
  }

  @ApiOperation({ summary: '소식 리스트 - 구독 이후의 모두 구독한 리스트', description: '소식 리스트 - 구독 이후의  모두 구독한 리스트' })
  @ApiResponse({
    status: 200,
    description: '총갯수와 리스트',
    type: SubscribeNewsListModel,
  })
  @ApiResponse({
    status: 400,
    description: '파라미터 유효성 맞지 않음',
  })
  @ApiCreatedResponse({ description: '소식 리스트 결과' })
  @Get('student/news/lts')
  async getAllNewsListLts(@Query() dto: GetAllNewsListDto): Promise<SubscribeNewsListModel> {
    const info = await this.studentService.getAllNewsListLts(dto)
    return info
  }

  @ApiOperation({
    summary: '소식 리스트 - 구독 취소후, 취소전 구독 리스트도 보이게',
    description: '소식 리스트 - 구독 취소후, 취소전 구독 리스트도 보이게',
  })
  @ApiResponse({
    status: 200,
    description: '총갯수와 리스트',
    type: SubscribeNewsListModel,
  })
  @ApiResponse({
    status: 400,
    description: '파라미터 유효성 맞지 않음',
  })
  @ApiCreatedResponse({ description: '소식 리스트 결과' })
  @Get('student/news/uns')
  async getAllNewsListUns(@Query() dto: GetAllNewsListDto): Promise<SubscribeNewsListModel> {
    const info = await this.studentService.getAllNewsListUns(dto)
    return info
  }
}

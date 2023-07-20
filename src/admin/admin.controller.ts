import { Body, Controller, Post, Get, Query, Put, Delete } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateNoticeDto, CreatePageInfoDto, GetPageListInfoDto, RemoveNoticeDto, UpdateNoticeDto } from './admin.dto'
import { AdminService } from './admin.service'
import { PageInfoListModel } from './model/pageInfoList'

@ApiTags('Admin')
@Controller()
export class AdminControll {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: '학교 페이지 저장', description: '학교 페이지 저장' })
  @ApiResponse({
    status: 201,
    description: 'bool 타입으로 성공 여부 체크',
  })
  @ApiResponse({
    status: 401,
    description: '중복된 지역,학교',
  })
  @ApiResponse({
    status: 400,
    description: '파라미터 유효성 맞지 않음',
  })
  @Post('admin/page')
  async addPageInfo(@Body() dto: CreatePageInfoDto): Promise<boolean> {
    const info = await this.adminService.addPageInfo(dto)
    return info
  }

  @ApiOperation({ summary: '학교 페이지 리스트', description: '학교 페이지 리스트를 가져옵니다' })
  @ApiResponse({
    status: 200,
    description: '총갯수와 리스트',
    type: PageInfoListModel,
  })
  @ApiResponse({
    status: 400,
    description: '파라미터 유효성 맞지 않음',
  })
  @Get('admin/page')
  async ticketList(@Query() dto: GetPageListInfoDto): Promise<PageInfoListModel> {
    const info = await this.adminService.getPageInfoList(dto)
    return info
  }

  @ApiOperation({ summary: '학교 소식 저장', description: '학교 소식 저장' })
  @ApiResponse({
    status: 201,
    description: 'bool 타입으로 성공 여부 체크',
  })
  @ApiResponse({
    status: 400,
    description: '파라미터 유효성 맞지 않음',
  })
  @Post('admin/notice')
  async addNotice(@Body() dto: CreateNoticeDto): Promise<boolean> {
    const info = await this.adminService.addNotice(dto)
    return info
  }

  @ApiOperation({ summary: '학교 소식 수정', description: '학교 소식 수정' })
  @ApiResponse({
    status: 201,
    description: 'bool 타입으로 성공 여부 체크',
  })
  @ApiResponse({
    status: 400,
    description: '파라미터 유효성 맞지 않음',
  })
  @Put('admin/notice')
  async updateNotice(@Body() dto: UpdateNoticeDto): Promise<boolean> {
    const info = await this.adminService.updateNotice(dto)
    return info
  }

  @ApiOperation({ summary: '학교 소식 삭제', description: '학교 소식 삭제' })
  @ApiResponse({
    status: 201,
    description: 'bool 타입으로 성공 여부 체크',
  })
  @ApiResponse({
    status: 400,
    description: '파라미터 유효성 맞지 않음',
  })
  @Delete('admin/notice')
  async removeNotice(@Body() dto: RemoveNoticeDto): Promise<boolean> {
    const info = await this.adminService.removeNotice(dto)
    return info
  }
}

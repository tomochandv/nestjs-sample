import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'

export class AddSubscribeDto {
  @ApiProperty({ description: '학생아이디', default: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly studentIdx: number

  @ApiProperty({ description: '학교 페이지 아이디', default: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly pageIdx: number
}

export class RemoveSubscribeDto {
  @ApiProperty({ description: '구독아이디', default: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly idx: number
}

export class GetSubscribeListDto {
  @ApiProperty({ description: '학생아이디', default: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly studentIdx: number

  @ApiProperty({ description: '페이지', default: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly page: number

  @ApiProperty({ description: '행수', default: 10, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly rows: number
}

export class GetNewsListDto {
  @ApiProperty({ description: '학생아이디', default: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly studentIdx: number

  @ApiProperty({ description: '학교 페이지 아이디', default: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly pageIdx: number

  @ApiProperty({ description: '페이지', default: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly page: number

  @ApiProperty({ description: '행수', default: 10, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly rows: number
}

export class GetAllNewsListDto {
  @ApiProperty({ description: '학생아이디', default: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly studentIdx: number

  @ApiProperty({ description: '페이지', default: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly page: number

  @ApiProperty({ description: '행수', default: 10, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly rows: number
}

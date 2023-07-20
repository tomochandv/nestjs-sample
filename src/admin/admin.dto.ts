import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator'

export class CreatePageInfoDto {
  @ApiProperty({ description: '지역', default: '서울', required: true })
  @IsString()
  @MaxLength(20)
  @MinLength(1)
  readonly region: string

  @ApiProperty({ description: '학교명', default: '학교명', required: true })
  @IsString()
  @MaxLength(100)
  @MinLength(1)
  readonly name: string
}

export class GetPageListInfoDto {
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

export class CreateNoticeDto {
  @ApiProperty({ description: '학교페이지 아이디', default: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly idx: number

  @ApiProperty({ description: '소식', default: '소식', required: true })
  @IsString()
  readonly contents: string
}

export class RemoveNoticeDto {
  @ApiProperty({ description: '소식 아이디', default: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly idx: number
}

export class UpdateNoticeDto {
  @ApiProperty({ description: '소식 아이디', default: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly idx: number

  @ApiProperty({ description: '소식', default: '소식', required: true })
  @IsString()
  readonly contents: string
}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PageInfoEntity } from 'src/entities/pageInfo.entity'
import { NoticeEntity } from 'src/entities/notice.entity'
import { AdminService } from './admin.service'
import { AdminControll } from './admin.controller'

@Module({
  imports: [TypeOrmModule.forFeature([PageInfoEntity, NoticeEntity])],
  providers: [AdminService],
  controllers: [AdminControll],
  exports: [],
})
export class AdminModule {}

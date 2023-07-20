import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PageInfoEntity } from 'src/entities/pageInfo.entity'
import { NoticeEntity } from 'src/entities/notice.entity'
import { StudentService } from './students.service'
import { StudentControll } from './students.controll'
import { SubscribeEntity } from 'src/entities/subscribe.entity'

@Module({
  imports: [TypeOrmModule.forFeature([PageInfoEntity, NoticeEntity, SubscribeEntity])],
  providers: [StudentService],
  controllers: [StudentControll],
  exports: [],
})
export class StudentModule {}

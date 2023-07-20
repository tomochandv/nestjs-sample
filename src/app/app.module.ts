import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as path from 'path'
import { AdminModule } from '../admin/admin.module'
import { StudentModule } from '../students/students.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_URL,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PWD,
      database: 'test',
      entities: [path.join(__dirname, '..', '/entities/*.entity{.ts,.js}')],
      synchronize: true,
      timezone: 'local',
      logging: true,
    }),
    AdminModule,
    StudentModule,
  ],
})
export class AppModule {}

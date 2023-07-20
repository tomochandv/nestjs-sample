import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ValidationPipe } from '@nestjs/common'
import { setupSwagger } from './swagger/swagger'
import { GlobalExceptionFilter } from './filter/exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true }, forbidNonWhitelisted: true }))
  app.enableCors()
  app.useGlobalFilters(new GlobalExceptionFilter())
  setupSwagger(app)
  await app.listen(3000)
}
bootstrap()

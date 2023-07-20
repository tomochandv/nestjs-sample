import { INestApplication } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

/**
 * Swagger 세팅
 *
 * @param {INestApplication} app
 */
export const setupSwagger = (app: INestApplication): void => {
  const options = new DocumentBuilder().setTitle('Test API').setDescription(' Restapi Aplication').setVersion('1.0.0').build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)
}

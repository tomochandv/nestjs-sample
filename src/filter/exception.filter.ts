import { Catch, ArgumentsHost, HttpException, Injectable } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Request, Response } from 'express'

@Injectable()
@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    if (exception.getStatus) {
      response.statusCode = exception.getStatus()
      response.json(exception.getResponse())
    } else {
      response.statusCode = 500
      response.json(JSON.stringify(exception))
    }
  }
}

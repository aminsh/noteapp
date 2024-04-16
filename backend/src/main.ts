import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { join } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { TcpExceptionFilter } from './event/filter/tcp-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()

  const tcpMicroservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
  })

  tcpMicroservice.useGlobalFilters(new TcpExceptionFilter())

  const validations = { whitelist: true, forbidNonWhitelisted: true }
  app.useGlobalPipes(new ValidationPipe(validations))
  app.useStaticAssets(join(process.cwd(), 'files'), { prefix: '/files' })

  await app.startAllMicroservices()
  await app.listen(process.env.PORT)
}

bootstrap()

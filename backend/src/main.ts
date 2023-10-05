import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()

  const validations = { whitelist: true, forbidNonWhitelisted: true }
  app.useGlobalPipes(new ValidationPipe(validations))
  app.useStaticAssets(join(process.cwd(), 'files'), { prefix: '/files' })
  await app.listen(process.env.PORT)
}

bootstrap()

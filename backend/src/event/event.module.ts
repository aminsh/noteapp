import { Module } from '@nestjs/common'
import { MainGateway } from './gateway/main-gateway'

@Module({
  providers: [
    MainGateway,
  ],
})
export class EventModule {}
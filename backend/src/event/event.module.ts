import { Module } from '@nestjs/common'
import { MainGateway } from './gateway/main-gateway'
import { SharedModule } from '../shared/shared.module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { MESSAGE_SERVICE } from '../shared/shared.contacts'
import { NoteModule } from '../note/note.module'
import { SubjectService } from './service/subject.service'

@Module({
  imports: [
    ClientsModule.register([
      {name: MESSAGE_SERVICE, transport: Transport.TCP},
    ]),
    SharedModule,
    NoteModule,
  ],
  providers: [
    MainGateway,
    SubjectService,
  ],
})
export class EventModule {
}
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Note, NoteSchema } from './schema/note'
import { NoteService } from './service/note.service'
import { NoteRepository } from './repository/note.repository'
import { NoteResolver } from './resolver/note.resolver'
import { NoteQueryService } from './service/note-query.service'
import { NoteMessageController } from './controller/note-message.controller'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { MESSAGE_SERVICE } from '../shared/shared.contacts'

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Note.name, schema: NoteSchema},
    ]),
    ClientsModule.register([
      {name: MESSAGE_SERVICE, transport: Transport.TCP},
    ]),
  ],
  controllers: [
    NoteMessageController,
  ],
  providers: [
    NoteRepository,
    NoteService,
    NoteResolver,
    NoteQueryService,
  ],
  exports: [
    NoteService,
    NoteQueryService,
  ]
})
export class NoteModule {
}

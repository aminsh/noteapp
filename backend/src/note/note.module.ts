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
import {
  NoteContent,
  NoteContentSchema,
} from './schema/note-content'
import { NoteTextContent, NoteTextContentSchema } from './schema/note-text-content'
import { NoteImageContent, NoteImageContentSchema } from './schema/note-image-content'
import { NoteFileContent, NoteFileContentSchema } from './schema/note-file-content'

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Note.name, schema: NoteSchema},
      {
        name: NoteContent.name, schema: NoteContentSchema, discriminators: [
          {name: NoteTextContent.name, schema: NoteTextContentSchema},
          {name: NoteImageContent.name, schema: NoteImageContentSchema},
          {name: NoteFileContent.name, schema: NoteFileContentSchema},
        ]
      }
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

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './schema/note';
import { NoteService } from './service/note.service';
import { NoteRepository } from './repository/note.repository';
import { NoteResolver } from './resolver/note.resolver';
import { NoteController } from './note.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Note.name, schema: NoteSchema }
    ])
  ],
  providers: [
    NoteRepository,
    NoteService,
    NoteResolver
  ],
  controllers: [
    NoteController
  ]
})
export class NoteModule {

}

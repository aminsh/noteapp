import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './schema/note';
import { NoteService } from './service/note.service';
import { NoteController } from './controller/note.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Note.name, schema: NoteSchema }
    ])
  ],
  providers: [
    NoteService
  ],
  controllers: [
    NoteController
  ]
})
export class NoteModule {

}

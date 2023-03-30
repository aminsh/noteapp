import { Body, Controller, Get, Post } from '@nestjs/common';
import { NoteService } from '../service/note.service';
import { NoteDto } from '../dto/note.dto';
import { Note } from '../schema/note';
import { NoteView } from '../dto/note.view';

@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Post()
  create(@Body() dto: NoteDto): Promise<Note> {
    return this.noteService.create(dto);
  }

  @Get()
  find(): Promise<NoteView[]> {
    return this.noteService.find();
  }
}

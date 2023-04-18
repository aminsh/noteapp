import { Note } from '../schema/note';
import { NoteView } from './note.view';
import { userAssembler } from '../../user/dto/user-assembler';
import { fileAssembler } from '../../shared/dto/file-assembler';

export const noteAssembler = (entity: Note): NoteView => {
  if(!entity)
    return ;

  return  {
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    id: entity._id,
    title: entity.title,
    content: entity.content,
    owner: userAssembler(entity.owner),
    attachments: entity.attachments.map(fileAssembler)
  }
}

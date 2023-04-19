import { NoteShared } from '../schema/note-shared';
import { NoteSharedView } from './note-shared.view';
import { userAssembler } from '../../user/dto/user-assembler';

export const noteSharedAssembler = (input: NoteShared): NoteSharedView => {
  if (!input)
    return;

  return {
    user: userAssembler(input.user),
    access: input.access
  }
};

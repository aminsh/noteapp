import { InjectModel } from '@nestjs/mongoose';
import { Note } from '../schema/note';
import { Model } from 'mongoose';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NoteView } from '../dto/note.view';
import { NoteService } from '../service/note.service';
import { NoteDto } from '../dto/note.dto';
import { VoidResolver } from 'graphql-scalars';
import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthenticationGuard } from 'dx-nest-core/auth';
import { noteAssembler } from '../dto/note-assembler';
import { RequestContext } from '../../shared/service/request-context';

@UseGuards(JwtGqlAuthenticationGuard)
@Resolver(() => NoteView)
export class NoteResolver {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>,
              private noteService: NoteService,
              private requestContext: RequestContext) {}

  @Query(() => [ NoteView ], { name: 'NoteFind' })
  async find(): Promise<NoteView[]> {
    const data = await this.noteModel.find({
      owner: {
        _id: this.requestContext.authenticatedUser.id
      }
    })
      .populate('owner')
      .populate('attachments');
    return data.map(noteAssembler);
  }

  @Mutation(() => NoteView, { name: 'NoteCreate' })
  async create(@Args('noteCreate') dto: NoteDto): Promise<NoteView> {
    const result = await this.noteService.create(dto);
    return noteAssembler(result);
  }

  @Mutation(() => VoidResolver, {
    name: 'NoteUpdate',
    nullable: true
  })
  update(@Args('noteId') id: string,
         @Args('noteUpdate') dto: NoteDto): Promise<void> {
    return this.noteService.update(id, dto);
  }

  @Mutation(() => VoidResolver, {
    name: 'NoteRemove',
    nullable: true
  })
  remove(@Args('noteId') id: string): Promise<void> {
    return this.noteService.remove(id);
  }
}

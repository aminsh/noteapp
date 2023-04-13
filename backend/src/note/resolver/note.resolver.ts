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

@UseGuards(JwtGqlAuthenticationGuard)
@Resolver(() => NoteView)
export class NoteResolver {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>,
              private noteService: NoteService) {}

  private static assembler(entity: Note): NoteView {
    return {
      id: entity._id,
      title: entity.title,
      content: entity.content,
      owner: entity.owner
        ? { id: entity.owner._id, email: entity.owner.email, name: entity.owner.name }
        : null
    }
  }

  @Query(() => [ NoteView ], { name: 'NoteFind' })
  async find(): Promise<NoteView[]> {
    const data = await this.noteModel.find().populate('owner');
    return data.map(NoteResolver.assembler);
  }

  @Mutation(() => NoteView, { name: 'NoteCreate' })
  async create(@Args('noteCreate') dto: NoteDto): Promise<NoteView> {
    const result = await this.noteService.create(dto);
    return NoteResolver.assembler(result);
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

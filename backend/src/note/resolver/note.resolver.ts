import { InjectModel } from '@nestjs/mongoose'
import { Note } from '../schema/note'
import { Model } from 'mongoose'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { NotePageableResponse, NoteView } from '../dto/note.view'
import { NoteService } from '../service/note.service'
import { NoteDto } from '../dto/note.dto'
import { VoidResolver } from 'graphql-scalars'
import { UseGuards } from '@nestjs/common'
import { JwtGqlAuthenticationGuard } from 'dx-nest-core/auth'
import { noteAssembler } from '../dto/note-assembler'
import { NpRequestContext } from '../../shared/service/np-request-context.service'
import { NoteShareDTO } from '../dto/note-shared.dto'
import { handleNoteFileRequest, NoteFileRequest } from '../dto/note-file.request'

@UseGuards(JwtGqlAuthenticationGuard)
@Resolver(() => NoteView)
export class NoteResolver {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    private noteService: NoteService,
    private requestContext: NpRequestContext,
  ) {
  }

  @Query(() => NotePageableResponse, {name: 'notesFind'})
  async find(
    @Args('request', {type: () => NoteFileRequest}) request: NoteFileRequest,
  ): Promise<NotePageableResponse> {
    const {filter} = handleNoteFileRequest(request, this.requestContext.authenticatedUser.id)

    const [data, count] = await Promise.all([
      this.noteModel.find(filter)
        .populate('owner')
        .populate('attachments')
        .populate({path: 'shared', populate: {path: 'user'}})
        .limit(request.take)
        .skip(request.skip),
      this.noteModel.count(filter),
    ])

    return {
      data: data.map(noteAssembler),
      count,
    }
  }

  @Mutation(() => NoteView, {name: 'noteCreate'})
  async create(@Args('noteCreate') dto: NoteDto): Promise<NoteView> {
    const result = await this.noteService.create(dto)
    return noteAssembler(result)
  }

  @Mutation(() => VoidResolver, {
    name: 'noteUpdate',
    nullable: true,
  })
  update(
    @Args('noteId') id: string,
    @Args('noteUpdate') dto: NoteDto,
  ): Promise<void> {
    return this.noteService.update(id, dto)
  }

  @Mutation(() => VoidResolver, {
    name: 'noteRemove',
    nullable: true,
  })
  remove(@Args('noteId') id: string): Promise<void> {
    return this.noteService.remove(id)
  }

  @Mutation(() => VoidResolver, {
    name: 'noteShare',
    nullable: true,
  })
  share(
    @Args('noteId') id: string,
    @Args({name: 'noteShare', type: () => [NoteShareDTO]}) dto: NoteShareDTO[],
  ): Promise<void> {
    return this.noteService.share(id, dto)
  }
}

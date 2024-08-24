import { InjectModel } from '@nestjs/mongoose'
import { Note } from '../schema/note'
import { Model } from 'mongoose'
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { NotePageableResponse, NoteView } from '../dto/note.view'
import { NoteService } from '../service/note.service'
import { NoteDto } from '../dto/note.dto'
import { VoidResolver } from 'graphql-scalars'
import { UseGuards } from '@nestjs/common'
import { JwtGqlAuthenticationGuard } from 'dx-nest-core/auth'
import { noteAssembler } from '../dto/note-assembler'
import { NpRequestContext } from '../../shared/service/np-request-context.service'
import { NoteShareDTO } from '../dto/note-shared.dto'
import { handleNoteFindRequest, NoteFindRequest } from '../dto/note-find.request'
import { PubSub } from 'graphql-subscriptions'

const pubSub = new PubSub()

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
    @Args('request', {type: () => NoteFindRequest}) request: NoteFindRequest,
  ): Promise<NotePageableResponse> {
    const {filter} = handleNoteFindRequest(request, this.requestContext.authenticatedUser.id)

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
  async create(@Args('input') dto: NoteDto): Promise<NoteView> {
    const newNote = await this.noteService.create(dto)

    const view = noteAssembler(newNote)

    await pubSub.publish('noteCreated', {noteCreated: view})

    return view
  }

  @Mutation(() => VoidResolver, {
    name: 'noteUpdate',
    nullable: true,
  })
  update(
    @Args('id') id: string,
    @Args('input') dto: NoteDto,
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
    @Args('id') id: string,
    @Args({name: 'input', type: () => [NoteShareDTO]}) dto: NoteShareDTO[],
  ): Promise<void> {
    return this.noteService.share(id, dto)
  }
}

@Resolver(() => NoteView)
export class NoteSubscriptionResolver {
  @Subscription(() => NoteView, {
    name: 'noteCreated'
  })
  noteCreated() {
    return pubSub.asyncIterator('noteCreated')
  }
}

import { NoteService } from './note.service'
import { NoteRepository } from '../repository/note.repository'
import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Note } from '../schema/note'
import { NoteDto } from '../dto/note.dto'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { UserRepository } from '../../user/repository/user.repository'
import { AuthenticatedUser } from '../../user/user.type'
import { User } from '../../user/shema/user'
import { RequestContext } from '../../shared/service/request-context'
import { FileRepository } from '../../shared/repository/file.repository'
import { File } from '../../shared/schema/file'
import { NOTE_MESSAGE } from '../note.constants'
import { NoteShareDTO } from '../dto/note-shared.dto'
import { NoteAccess } from '../schema/note-shared'

describe('Note Service test', () => {
  let mockModelNote: Model<Note>
  let mockModelUser: Model<User>
  let mockModelFile: Model<File>
  let noteService: NoteService
  let noteRepository: NoteRepository
  let userRepository: UserRepository
  let fileRepository: FileRepository

  const authenticatedUser: AuthenticatedUser = {
    id: 'AUTHENTICATED-USER-ID',
    email: 'user@email.com'
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        NoteService,
        NoteRepository,
        UserRepository,
        FileRepository,
        {
          provide: getModelToken(Note.name),
          useValue: Model
        },
        {
          provide: getModelToken(User.name),
          useValue: Model
        },
        {
          provide: getModelToken(File.name),
          useValue: Model
        },
        {
          provide: RequestContext,
          useValue: { authenticatedUser }
        }
      ]
    })
      .compile()

    mockModelNote = moduleRef.get<Model<Note>>(getModelToken(Note.name))
    mockModelUser = moduleRef.get(getModelToken(User.name))
    mockModelFile = moduleRef.get(getModelToken(File.name))
    noteRepository = moduleRef.get(NoteRepository)
    noteService = await moduleRef.resolve(NoteService)
    userRepository = moduleRef.get(UserRepository)
    fileRepository = moduleRef.get(FileRepository)
  })

  describe('Create Method', () => {
    it('should be succeed', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue({ _id: authenticatedUser.id, email: authenticatedUser.email } as User)

      const dto: NoteDto = {
        title: 'This is note title',
        content: 'This is note content'
      }

      let isCalledRepository = false

      jest.spyOn(noteRepository, 'create')
        .mockImplementation(async (entity: Note) => {
          isCalledRepository = true
          return {
            _id: 'NOTE-ID',
            ...entity
          }
        })

      const entity = await noteService.create(dto)

      expect(isCalledRepository).toBeTruthy()
      expect(entity.title).toBe(dto.title)
      expect(entity.content).toBe(dto.content)
    })

    it('should have owner', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue({ _id: authenticatedUser.id, email: authenticatedUser.email } as User)

      const dto: NoteDto = {
        title: 'This is note title',
        content: 'This is note content'
      }

      let assignedOwner: User

      jest.spyOn(noteRepository, 'create')
        .mockImplementation(async (entity: Note) => {
          assignedOwner = entity.owner
          return entity
        })

      const entity = await noteService.create(dto)

      expect(entity.owner._id).toBe(authenticatedUser.id)
    })
  })

  describe('Update Method', () => {
    it('should throw NotFoundException', async () => {
      const dto: NoteDto = {
        title: 'This is note title',
        content: 'This is note content'
      }
      const id = 'NOTE-ID'

      jest
        .spyOn(noteRepository, 'findOne')
        .mockResolvedValue(null)

      await expect(noteService.update(id, dto))
        .rejects.toBeInstanceOf(NotFoundException)
    })

    it('should throw Exception when the user is not owner', async () => {
      const dto: NoteDto = {
        title: 'This is note title',
        content: 'This is note content'
      }
      const id = 'NOTE-ID'
      const userId = 'USER-ID'

      jest
        .spyOn(noteRepository, 'findOne')
        .mockResolvedValue({ _id: id, owner: { _id: userId } } as Note)

      try {
        await noteService.update(id, dto)
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException)
        expect(e.message).toBe(NOTE_MESSAGE.THE_CURRENT_USER_IS_NOT_ALLOWED_TO_EDIT_THE_NOTE)
      }
    })

    it('should be succeed', async () => {
      const dto: NoteDto = {
        title: 'This is note title',
        content: 'This is note content'
      }
      const id = 'NOTE-ID'

      let isCalledRepository = false
      let entityArgument: Note

      jest
        .spyOn(noteRepository, 'findOne')
        .mockResolvedValue({ owner: { _id: authenticatedUser.id } } as Note)

      jest.spyOn(noteRepository, 'update')
        .mockImplementation(async (entity: Note) => {
          isCalledRepository = true
          entityArgument = entity
        })

      await noteService.update(id, dto)

      expect(isCalledRepository).toBeTruthy()
      expect(entityArgument.title).toBe(dto.title)
      expect(entityArgument.content).toBe(dto.content)
    })
  })

  describe('Remove Method', () => {
    it('should throw NotFoundException', async () => {
      const id = 'NOTE-ID'

      jest
        .spyOn(noteRepository, 'findOne')
        .mockResolvedValue(null)

      await expect(noteService.remove(id))
        .rejects.toBeInstanceOf(NotFoundException)
    })

    it('should be succeed', async () => {
      const id = 'NOTE-ID'

      let isCalledRepository = false

      jest
        .spyOn(noteRepository, 'findOne')
        .mockResolvedValue({} as Note)

      jest.spyOn(noteRepository, 'remove')
        .mockImplementation(async () => {
          isCalledRepository = true
        })

      await noteService.remove(id)

      expect(isCalledRepository).toBeTruthy()
    })
  })

  describe('Attachments test', () => {
    it('should be throw when attachments are invalid', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue({ _id: authenticatedUser.id, email: authenticatedUser.email } as User)

      jest.spyOn(fileRepository, 'find')
        .mockResolvedValue([
          { _id: 'first' } as File
        ])

      try {
        await noteService['resolveFiles']([ 'first', 'second' ], new Note())
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException)
        expect(e.message).toBe(NOTE_MESSAGE.FILES_IS_INVALID)
      }
    })

    it('should be succeed', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue({ _id: authenticatedUser.id, email: authenticatedUser.email } as User)

      jest.spyOn(fileRepository, 'find')
        .mockResolvedValue([
          { _id: 'first' } as File,
          { _id: 'second' } as File
        ])

      const entity = new Note()
      await noteService['resolveFiles']([ 'first', 'second' ], entity)

      expect(entity.attachments.length).toBe(2)
    })
  })

  describe('Share Users', () => {
    it('should throw NotFoundException when note is not exist', async () => {
      const noteId = 'NOTE-ID'
      const userId = 'USER-ID'
      const shareDTO: NoteShareDTO[] = [
        { userId, access: NoteAccess.AllowEdit }
      ]

      jest
        .spyOn(noteRepository, 'findOne')
        .mockResolvedValue(null)

      await expect(noteService.share(noteId, shareDTO)).rejects.toBeInstanceOf(NotFoundException)
    })

    it('User is not allowed to share a note with yourself', async () => {
      const noteId = 'NOTE-ID'
      const userId = 'USER-ID'
      const shareDTO: NoteShareDTO[] = [
        { userId, access: NoteAccess.AllowEdit }
      ]

      jest
        .spyOn(noteRepository, 'findOne')
        .mockResolvedValue({ owner: { _id: userId } } as Note)

      try {
        await noteService.share(noteId, shareDTO)
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException)
        expect(e.message).toBe(NOTE_MESSAGE.USER_IS_NOT_ALLOWED_TO_SHARE_A_NOTE_WITH_YOURSELF)
      }
    })

    it('should throw Exception when users in share DTO are not valid', async () => {
      const noteId = 'NOTE-ID'
      const userId = 'USER-ID'
      const shareDTO: NoteShareDTO[] = [
        { userId: 'OTHER-USER', access: NoteAccess.AllowEdit }
      ]

      jest
        .spyOn(noteRepository, 'findOne')
        .mockResolvedValue({ owner: { _id: userId } } as Note)

      jest
        .spyOn(userRepository, 'find')
        .mockResolvedValue([])

      try {
        await noteService.share(noteId, shareDTO)
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException)
        expect(e.message).toBe(NOTE_MESSAGE.ONE_OR_MORE_USERS_ARE_INVALID)
      }
    })

    it('should throw Exception when the user doesnt have access to edit the note', async () => {
      const dto: NoteDto = {
        title: 'This is note title',
        content: 'This is note content'
      }
      const id = 'NOTE-ID'
      const userId = 'USER-ID'

      jest
        .spyOn(noteRepository, 'findOne')
        .mockResolvedValue({
          _id: id,
          owner: { _id: userId },
          shared: [ { user: { _id: 'ANY-USER' }, access: NoteAccess.ViewOnly } ]
        } as Note)

      try {
        await noteService.update(id, dto)
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException)
        expect(e.message).toBe(NOTE_MESSAGE.THE_CURRENT_USER_IS_NOT_ALLOWED_TO_EDIT_THE_NOTE)
      }
    })
  })
})

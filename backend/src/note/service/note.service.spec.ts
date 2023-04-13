import { NoteService } from './note.service';
import { NoteRepository } from '../repository/note.repository';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from '../schema/note';
import { NoteDto } from '../dto/note.dto';
import { NotFoundException } from '@nestjs/common';

describe('Note Service test', () => {
  let mockModelNote: Model<Note>;
  let noteService: NoteService;
  let noteRepository: NoteRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        NoteService,
        NoteRepository,
        {
          provide: getModelToken(Note.name),
          useValue: Model
        },
      ]
    })
      .compile();

    mockModelNote = moduleRef.get<Model<Note>>(getModelToken(Note.name));
    noteRepository = moduleRef.get(NoteRepository);
    noteService = moduleRef.get(NoteService);
  });

  describe('Create Method', () => {
    it('should be succeed', async () => {
      const dto: NoteDto = {
        title: 'This is note title',
        content: 'This is note content'
      };

      let isCalledRepository: boolean = false;

      jest.spyOn(noteRepository, 'create')
        .mockImplementation(async (entity: Note) => {
          isCalledRepository = true;
          return {
            _id: 'NOTE-ID',
            ...entity
          };
        });

      const entity = await noteService.create(dto);

      expect(isCalledRepository).toBeTruthy();
      expect(entity.title).toBe(dto.title);
      expect(entity.content).toBe(dto.content);
    });
  });

  describe('Update Method', () => {
    it('should throw NotFoundException', async () => {
      const dto: NoteDto = {
        title: 'This is note title',
        content: 'This is note content'
      };
      const id = 'NOTE-ID';

      jest
        .spyOn(noteRepository, 'findOne')
        .mockResolvedValue(null);

      await expect(noteService.update(id, dto))
        .rejects.toBeInstanceOf(NotFoundException)
    });

    it('should be succeed', async () => {
      const dto: NoteDto = {
        title: 'This is note title',
        content: 'This is note content'
      };
      const id = 'NOTE-ID';

      let isCalledRepository: boolean = false;
      let entityArgument: Note;

      jest
        .spyOn(noteRepository, 'findOne')
        .mockResolvedValue({  } as Note);

      jest.spyOn(noteRepository, 'update')
        .mockImplementation(async (entity: Note) => {
          isCalledRepository = true;
          entityArgument = entity;
        });

      await noteService.update(id, dto);

      expect(isCalledRepository).toBeTruthy();
      expect(entityArgument.title).toBe(dto.title);
      expect(entityArgument.content).toBe(dto.content);
    });
  })

  describe('Remove Method', () => {
    it('should throw NotFoundException', async () => {
      const id = 'NOTE-ID';

      jest
        .spyOn(noteRepository, 'findOne')
        .mockResolvedValue(null);

      await expect(noteService.remove(id))
        .rejects.toBeInstanceOf(NotFoundException)
    });

    it('should be succeed', async () => {
      const id = 'NOTE-ID';

      let isCalledRepository: boolean = false;

      jest
        .spyOn(noteRepository, 'findOne')
        .mockResolvedValue({  } as Note);

      jest.spyOn(noteRepository, 'remove')
        .mockImplementation(async () => {
          isCalledRepository = true;
        });

      await noteService.remove(id);

      expect(isCalledRepository).toBeTruthy();
    });
  })
})

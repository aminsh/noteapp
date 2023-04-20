import { Test } from '@nestjs/testing'
import { User } from '../shema/user'
import { getModelToken } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { JWT_TOKEN_GENERATOR_SERVICE } from 'dx-nest-core/auth'
import { UserService } from './user.service'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { USER_MESSAGE } from '../user.constants'
import { UserRepository } from '../repository/user.repository'
import { hash } from '../../shared/utils'

describe('User Service', () => {
  let mockModelUser: Model<User>
  let userService: UserService
  let userRepository: UserRepository

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        {
          provide: getModelToken(User.name),
          useValue: Model
        },
        {
          provide: JWT_TOKEN_GENERATOR_SERVICE,
          useValue: {}
        }
      ]
    })
      .compile()

    mockModelUser = moduleRef.get<Model<User>>(getModelToken(User.name))
    userRepository = moduleRef.get(UserRepository)
    userService = moduleRef.get(UserService)
  })

  describe('Create Method', () => {
    it('should be failed because email is duplicated', async () => {
      const user = new User()
      user.email = 'user@email.com'

      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(user)

      try {
        await userService.create({
          email: user.email,
          password: user.password,
          name: user.name
        })
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException)
        expect(e.message).toBe(USER_MESSAGE.THE_EMAIL_IS_DUPLICATED)
      }
    })

    it('should be succeed', async () => {
      const user = new User()
      user._id = 'USER-ID'
      user.email = 'USER@email.com'
      user.name = 'User Name'
      user.password = '123456'

      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(null)

      jest.spyOn(userRepository, 'create')
        .mockImplementation(async (entity: User) => {
          entity._id = user._id
          return entity
        })

      const savedEntity = await userService.create({
        email: user.email,
        password: user.password,
        name: user.name
      })

      expect(savedEntity.email).toBe(user.email.toLowerCase())
      expect(savedEntity._id).toBe(user._id)
      expect(savedEntity.password).toBe(hash(user.password))
    })
  })

  describe('Update Method', () => {
    it('should throw NotFoundException because entity is not exist', async () => {
      const id = 'USER-ID'
      const user = new User()
      user.name = 'User Name'

      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(null)

      try {
        await userService.update(id, { name: user.name })
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException)
      }
    })
  })
})

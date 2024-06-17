import { Controller, Get, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { GoogleAuthService } from '../service/google-auth.service'

@Controller('v1/auth/google')
export class GoogleController {
  constructor(
    private googleAuthService: GoogleAuthService,
  ) {
  }

  @Get()
  googleAuth(
    @Res() res: Response,
    @Query('userId') userId: string
  ) {
    const url = this.googleAuthService.getUrl(userId)
    res.redirect(url)
  }

  @Get('redirect')
  async googleAuthRedirect(
    @Query('code') code: string,
    @Query('state') state: string
  ) {
    await this.googleAuthService.callback(code, state)
  }
}
/*65ea1a018388f4768fc36d14*/
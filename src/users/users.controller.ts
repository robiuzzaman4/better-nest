import { Controller, Get } from '@nestjs/common';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🔒 Protected — session required
  @Get('me')
  async getMe(@Session() session: UserSession) {
    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    };
  }
}

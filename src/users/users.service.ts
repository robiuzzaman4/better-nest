import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getUser(userId: string) {
    // Example: query the Better Auth user table directly via Drizzle
    // Better Auth's tables are available on the db instance
    return { id: userId }; // expand this as you need
  }
}

import { Module } from '@nestjs/common';
import { AuthFacadeController } from './auth-facade.controller';
import { AuthFacadeService } from './auth-facade.service';

@Module({
  controllers: [AuthFacadeController],
  providers: [AuthFacadeService],
})
export class AuthFacadeModule {}

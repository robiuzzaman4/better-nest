import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth/auth';
import { AuthModule } from './auth/auth.module';
import { ApiExceptionFilter } from './common/api-exception.filter';
import { ApiResponseInterceptor } from './common/api-response.interceptor';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    // === LOAD .ENV FILE - MUST BE FIRST ===
    ConfigModule.forRoot({
      isGlobal: true, // makes process.env available everywhere without re-importing
      envFilePath: '.env',
    }),

    // === REGISTER BETTER AUTH (AUTHGUARD REGISTERED GLOBALLY) ===
    // all routes protected by default unless decorated @AllowAnonymous()
    BetterAuthModule.forRoot({
      auth,
      disableControllers: true,
    }),

    // === REGISTER OWN FEATURE MODULES ===
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
  ],
})
export class AppModule {}

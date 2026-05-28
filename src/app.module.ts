import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth/auth';
// import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    // === LOAD .ENV FILE - MUST BE FIRST ===
    ConfigModule.forRoot({
      isGlobal: true, // makes process.env available everywhere without re-importing
      envFilePath: '.env',
    }),

    // === REGISTER BETTER AUTH (AUTHGUARD REGISTERED GLOBALLY) ===
    // all routes protected by default unless decorated @AllowAnonymous()
    AuthModule.forRoot({ auth }),

    // === REGISTER OWN FEATURE MODULES ===
    // UsersModule,
  ],
})
export class AppModule {}

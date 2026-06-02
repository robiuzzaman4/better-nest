import { Body, Controller, Post } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { apiResponse } from '../common/api-response';
import { AuthService } from './auth.service';

@Controller('auth')
@AllowAnonymous()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('phone-number/send-otp')
  async sendPhoneNumberOtp(@Body() body: unknown) {
    const data = await this.authService.sendPhoneNumberOtp(body);

    return apiResponse(data, 'Phone verification code sent');
  }

  @Post('phone-number/verify')
  async verifyPhoneNumber(@Body() body: unknown) {
    const data = await this.authService.verifyPhoneNumber(body);

    return apiResponse(data, 'Phone number verified');
  }

  @Post('phone-number/register')
  async registerWithPhoneNumber(@Body() body: unknown) {
    const data = await this.authService.registerWithPhoneNumber(body);

    return apiResponse(data, 'Registration successful');
  }

  @Post('sign-in/phone-number')
  async signInPhoneNumber(@Body() body: unknown) {
    const data = await this.authService.signInPhoneNumber(body);

    return apiResponse(data, 'Signed in successfully');
  }

  @Post('phone-number/request-password-reset')
  async requestPasswordReset(@Body() body: unknown) {
    const data = await this.authService.requestPasswordReset(body);

    return apiResponse(data, 'Password reset code sent');
  }

  @Post('phone-number/reset-password')
  async resetPassword(@Body() body: unknown) {
    const data = await this.authService.resetPassword(body);

    return apiResponse(data, 'Password reset successfully');
  }
}

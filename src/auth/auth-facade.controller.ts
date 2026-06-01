import { Body, Controller, Post } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { apiResponse } from '../common/api-response';
import { AuthFacadeService } from './auth-facade.service';

@Controller('auth')
@AllowAnonymous()
export class AuthFacadeController {
  constructor(private readonly authFacadeService: AuthFacadeService) {}

  @Post('phone-number/send-otp')
  async sendPhoneNumberOtp(@Body() body: unknown) {
    const data = await this.authFacadeService.sendPhoneNumberOtp(body);

    return apiResponse(data, 'Phone verification code sent');
  }

  @Post('phone-number/verify')
  async verifyPhoneNumber(@Body() body: unknown) {
    const data = await this.authFacadeService.verifyPhoneNumber(body);

    return apiResponse(data, 'Phone number verified');
  }
}

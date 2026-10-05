import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsersModule } from '../users/users.module.js';
import { CredentialsService } from './credentials.service.js';
import { VerificationMailer } from './email-verification.mailer.js';
import { EmailVerificationController } from './email-verification.controller.js';
import { ResetPasswordMailer } from './reset-password.mailer.js';
import { ResetPasswordController } from './reset-password.controller.js';

@Module({
  imports: [UsersModule],
  controllers: [AuthController, EmailVerificationController, ResetPasswordController],
  providers: [AuthService, CredentialsService, VerificationMailer, ResetPasswordMailer],
})
export class AuthModule {}

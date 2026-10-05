import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { type SignInDto, signInSchema, signUpSchema, type SignUpDto } from './dto/auth.dto.js';
import { CredentialsService } from './credentials.service.js';
import { EmailVerificationService, Public, SignInService } from '@nestjs/authentication';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly credentialsService: CredentialsService, 
    private readonly signInService: SignInService,
    private readonly emailVerificationService: EmailVerificationService
  ) {}

  @Post("sign-up")
  async signUp(@Body({ schema: signUpSchema }) body: SignUpDto) {
    const user = await this.credentialsService.register(body);
    await this.signInService.signIn(user.id, { method: "password" });
    await this.emailVerificationService.send(user)
    return user;
  }

  @Post("sign-in")
  async signIn(@Body({ schema: signInSchema }) body: SignInDto) {
    const user = await this.credentialsService.verify(body);
    if (!user) throw new UnauthorizedException("Email or password data is invalid!");
    const { session } = await this.signInService.signIn(user.id, { method: "password" }); 
    return { mfaRequired: session.mfa === "pending" };
  }
}

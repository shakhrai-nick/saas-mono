import { CurrentUser, EmailVerificationService, Public } from "@nestjs/authentication";
import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post } from "@nestjs/common";
import { type User } from "../users/entities/user.entity.js";

@Controller("auth/email")
export class EmailVerificationController {
    constructor (private readonly emailVerificationService: EmailVerificationService) {}

    @Public()
    @Post("verify")
    @HttpCode(201)
    async verify(@Body("token") token: string) {
        const verified = await this.emailVerificationService.verify(token);
        if (!verified) {
            throw new BadRequestException("Verification link expired or invalid");
        }
        return { email: verified.email, verified: true };
    }

    @Post("resend")
    @HttpCode(202)
    async resend(@CurrentUser() user: User) {
        if (user.emailVerified) throw new ConflictException("Email already verified");
        await this.emailVerificationService.send(user);
    }
}
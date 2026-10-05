import { PasswordResetService } from "@nestjs/authentication";
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { type ResetPasswordDto, type EmailDto, emailSchema, resetPasswordSchema } from "./dto/auth.dto.js";

@Controller()
export class ResetPasswordController {
    constructor (private readonly resetPasswordService: PasswordResetService) {}

    @Post("forgot")
    async sendResetLink(@Body({ schema: emailSchema }) dto: EmailDto){
        this.resetPasswordService.request(dto.email);
    }

    @Post("reset")
    async reset(@Body({ schema: resetPasswordSchema }) dto: ResetPasswordDto) {
        const result = await this.resetPasswordService.reset(dto.token, dto.passwordHash, { signIn: true });
        if (!result) throw new BadRequestException("Link expired or invalid");
        return { mfaRequired: result.signedIn?.session.mfa === "pending" };
    }
}
import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service.js";
import { Mailable, MailContent, Mailer, MailRenderContext, MailTemplateContent } from "@nestjs/mail";
import { AuthenticationRegistry, PasswordResetHandler, PasswordResetLink } from "@nestjs/authentication";

@Injectable()
export class ResetPasswordMail implements Mailable<PasswordResetLink>{
    render(link: PasswordResetLink) {
        return {
            subject: "Reset your password",
            template: "reset-password",
            url: link
        }
    }
}

@Injectable()
export class ResetPasswordMailer extends PasswordResetHandler {
    constructor (
        private readonly usersService: UsersService,
        private readonly mailer: Mailer,
        registry: AuthenticationRegistry
    ) {
        super();
        registry.registerHandler("passwordReset", this)
    };

    async findUser(email: string) {
        return await this.usersService.findCredentials(email);
    }

    async send(link: PasswordResetLink) {
        await this.mailer.send(ResetPasswordMail, { to: link.email, data: link })
    }

    updatePassword(userId: string, passwordHash: string) {
        return this.usersService.updatePasswordHash(userId, passwordHash);
    }
}
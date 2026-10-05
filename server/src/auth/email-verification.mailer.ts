import { AuthenticationRegistry, EmailVerificationHandler, EmailVerificationLink } from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";
import { Mailable, MailContent, Mailer, MailRenderContext, MailTemplateContent } from "@nestjs/mail";
import { UsersService } from "../users/users.service.js";

@Injectable()
export class VerificationMail implements Mailable<EmailVerificationLink> {
    render({ url }: EmailVerificationLink){
        return {
            subject: "Verify your email",
            template: "verify-email",
            context: { url }
        }
    }
}

@Injectable()
export class VerificationMailer extends EmailVerificationHandler {
    constructor (
        private readonly usersService: UsersService,
        private readonly mailer: Mailer,
        registry: AuthenticationRegistry
    ) {
        super ();
        registry.registerHandler("emailVerification", this);
    };

    async send(link: EmailVerificationLink) {
        await this.mailer.send(VerificationMail, { to: link.email, data: link });
    }

    markVerified(userId: string, email: string) {
        return this.usersService.verifyEmail(userId, email);
    }
} 
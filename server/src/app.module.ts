import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AuthenticationModule } from '@nestjs/authentication';
import { FileTemplateEngine, LogMailTransport, MailModule, SmtpTransport } from "@nestjs/mail";
import { join } from "node:path";

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    MailModule.forRootAsync({
      useFactory: () => ({
        transport: process.env.SMTP_URL ? new SmtpTransport({ url: process.env.SMTP_URL }) : new LogMailTransport(),
        templates: new FileTemplateEngine({ dir: join(import.meta.dirname, "mail/templates")}),
        from: "Accounts <shaxrai.nick@gmail.com>"
      })
    }),
    AuthenticationModule.forRootAsync({
      useFactory: () => ({
        session: {
          absoluteTtl: "14d",
          idleTtl: "3d"
        },
        emailVerification: { url: `${process.env.APP_URL}/verify-email` },
        passwordReset: { url: `${process.env.APP_URL}/reset-password` }
      })
    }),
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'server',
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

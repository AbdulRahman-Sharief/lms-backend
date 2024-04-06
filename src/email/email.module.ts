import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: `smtps://${process.env.MAIL_USER}:${process.env.MAIL_PASS}@${process.env.MAIL_HOST}`,
      defaults: {
        from: 'AbdulRahmanSharief <AbdulRahmanSharief2@gmail.com>',
      },
      template: {
        dir: join(__dirname, '..', '..', 'views', 'mails'),
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
    // MailerModule.forRootAsync({
    //   useFactory: async (config: ConfigService) => ({
    //     transport: {
    //       host: config.get('MAIL_HOST'),
    //       secure: false,
    //       auth: {
    //         user: config.get('MAIL_USER'),
    //         password: config.get('MAIL_PASS'),
    //       },
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

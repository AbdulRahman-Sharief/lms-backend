import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}
  public async resetPassword(recipient: string, body: string): Promise<any> {
    await this.mailerService
      .sendMail({
        to: recipient, // list of receivers
        from: 'AbdulRahman <AbdulrahmanSharief2@gmail.com>', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: body, // plaintext body
        html: `<b>${body}</b>`, // HTML body content
      })
      .then((info) => {
        console.log('email sent: ', info.response);
      })
      .catch((e) => {
        console.log('ERROR: ', e);
      });
  }
  public async verficationToken(
    user: { name: string; email: string },
    activationCode: string,
  ): Promise<any> {
    await this.mailerService
      .sendMail({
        to: user.email, // list of receivers
        subject: 'Verifiy Your Email.', // Subject line
        template: './activation.mail.ejs',
        context: {
          user,
          activationCode,
        },
      })
      .then((info) => {
        console.log('email sent: ', info.response);
      })
      .catch((e) => {
        console.log('ERROR: ', e);
      });
  }
  public async Notification(
    user: { name: string; email: string },
    title: string,
  ): Promise<any> {
    await this.mailerService
      .sendMail({
        to: user.email, // list of receivers
        subject: 'New Notification.', // Subject line
        template: './question-reply.mail.ejs',
        context: {
          name: user.name,
          title,
        },
      })
      .then((info) => {
        console.log('email sent: ', info.response);
      })
      .catch((e) => {
        console.log('ERROR: ', e);
      });
  }

  public async OrderConfirmation(
    user: { email: string; name: string },
    order: { _id: string; name: string; price: number; date: string },
  ): Promise<any> {
    await this.mailerService
      .sendMail({
        to: user.email, // list of receivers
        subject: 'Order Confirmation', // Subject line
        template: './order-confirmation.mail.ejs',
        context: {
          name: user.name,
          order,
        },
      })
      .then((info) => {
        console.log('email sent: ', info.response);
      })
      .catch((e) => {
        console.log('ERROR: ', e);
      });
  }
}

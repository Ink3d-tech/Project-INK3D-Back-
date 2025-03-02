import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodeMailerService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || '',
    },
    debug: true,  // Habilita logs detallados
    logger: true, // Muestra eventos de conexión
  });

  async sendEmail(to: string, subject: string, text: string) {
    console.log('Enviando email a:', to);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Correo enviado con éxito:', info);
    } catch (error) {
      console.error('Error enviando correo:', error);
    }
  }
}

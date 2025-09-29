/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  InternalServerErrorException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';

import { Decoded } from './interfaces/auth.interface';
import { User } from 'src/users/entities/user.entity';

import {
  ChangePasswordDto,
  LoginUserDto,
  RegisterUserDto,
  ResetPasswordDto,
} from './dto';

import { BcryptAdapter, JwtAdapter } from 'src/config/adapters/security';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtAdapter: JwtAdapter,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly mailerService: MailerService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOneBy({
      email: loginUserDto.email,
    });

    if (!user) throw new NotFoundException('Credenciales inválidas');

    if (!user.isEmailVerified)
      throw new NotFoundException('La cuenta no está confirmada');

    const isValidPassword = this.bcryptAdapter.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isValidPassword) throw new NotFoundException('Credenciales inválidas');

    const token = await this.generateUserToken(user);

    const { password, ...resUser } = user;

    return {
      message: 'Sesión iniciada con éxito',
      data: { token, user: resUser },
    };
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await this.userRepository.findOneBy({
      email: registerUserDto.email,
    });

    if (existUser)
      throw new NotFoundException('Ya existe un usuario con ese email');

    const user = this.userRepository.create(registerUserDto);
    user.password = this.bcryptAdapter.hash(registerUserDto.password);

    await this.userRepository.save(user);
    const token = (await this.generateUserToken(user)) ?? '';

    await this.sendWelcomeEmail(user, token);

    return {
      message:
        '¡Te has registrado con éxito!. Te hemos enviado un correo de confirmación.',
      data: null,
    };
  }

  async changePassword(token: string, changePasswordDto: ChangePasswordDto) {
    const email = await this.checkUserToken(token);
    const user = await this.userRepository.findOneBy({ email });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.password = this.bcryptAdapter.hash(changePasswordDto.password);
    await this.userRepository.update(user.id, user);

    return { message: 'Contraseña actualizada', data: null };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userRepository.findOneBy({
      email: resetPasswordDto.email,
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const token = (await this.generateUserToken(user)) ?? '';
    await this.sendPasswordResetEmail(user, token);

    return {
      message:
        '¡Tu solicitud de cambio de contraseña ha sido enviada con éxito!',
      data: null,
    };
  }

  private async generateUserToken(user: User) {
    return this.jwtAdapter.generateToken({ id: user.id, email: user.email });
  }

  private async sendWelcomeEmail(user: User, token: string) {
    await this.mailerService.sendMail({
      to: user.email,
      from: process.env.MAIL_USER,
      subject: 'Bienvenido a FinTrack',
      html: `
        <h1>Hola ${user.username}, bienvenido a FinTrack</h1>
        <p>Tu gestor de transacciones personales y financieras. Confirma tu cuenta para empezar:</p>
        <a href="${process.env.APP_URL}/register/${token}">Confirmar cuenta</a>
      `,
    });
  }

  private async sendPasswordResetEmail(user: User, token: string) {
    await this.mailerService.sendMail({
      to: user.email,
      from: process.env.MAIL_USER,
      subject: 'Cambio de contraseña',
      html: `
        <h1>Cambio de contraseña</h1>
        <p>Para cambiar tu contraseña haz click en el siguiente enlace</p>
        <a href="${process.env.APP_URL}/change-password/${token}">Cambiar contraseña</a>
      `,
    });
  }

  private async checkUserToken(token: string) {
    try {
      const { email } = await this.jwtAdapter.verifyToken<Decoded>(token);
      if (!email) throw new NotFoundException('Usuario no encontrado');
      return email;
    } catch (error) {
      throw new InternalServerErrorException('Token inválido');
    }
  }

  async validateEmail(token: string) {
    const email = await this.checkUserToken(token);
    const user = await this.userRepository.findOneBy({ email });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.isEmailVerified = true;
    await this.userRepository.update(user.id, user);

    return {
      message:
        '¡Gracias por unirte a FinTrack, tu aliado para gestionar y optimizar tus transacciones!',
      data: null,
    };
  }
}

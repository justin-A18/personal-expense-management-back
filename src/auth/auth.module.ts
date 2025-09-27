import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BcryptAdapter, JwtAdapter } from 'src/config/adapters/security';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtAdapter, BcryptAdapter],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule, JwtAdapter],
})
export class AuthModule {}

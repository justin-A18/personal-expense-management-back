import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BcryptAdapter, JwtAdapter } from 'src/config/adapters/security';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from './guards/auth.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtAdapter, BcryptAdapter, AuthGuard],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule, JwtAdapter, AuthGuard],
})
export class AuthModule {}

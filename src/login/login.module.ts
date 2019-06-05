import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { Login } from './login.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Login])],
  providers: [LoginService],
  controllers: [LoginController],
})
export class LoginModule {}

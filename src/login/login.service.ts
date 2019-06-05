import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Login } from './login.entity';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(Login)
    private readonly loginRepository: Repository<Login>,
  ) {}

  findAll(): Promise<Login[]> {
    return this.loginRepository.find();
  }

  create(login: Partial<Login>): Promise<Login> {
    return this.loginRepository.save<Login>(this.loginRepository.create(login));
  }
}

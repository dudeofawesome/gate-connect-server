import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogLogin } from './log-login.entity';

@Injectable()
export class LogLoginService {
  constructor(
    @InjectRepository(LogLogin)
    private readonly LogLoginRepository: Repository<LogLogin>,
  ) {}

  findAll(): Promise<LogLogin[]> {
    return this.LogLoginRepository.find();
  }

  create(log-login: Partial<LogLogin>): Promise<LogLogin> {
    return this.LogLoginRepository.save<LogLogin>(this.LogLoginRepository.create(log-login));
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logins } from './logins.entity';

@Injectable()
export class LoginsService {
  constructor(
    @InjectRepository(Logins)
    private readonly loginsRepository: Repository<Logins>,
  ) {}

  findAll(): Promise<Logins[]> {
    return this.loginsRepository.find();
  }

  create(logins: Partial<Logins>): Promise<Logins> {
    return this.loginsRepository.save<Logins>(this.loginsRepository.create(logins));
  }
}

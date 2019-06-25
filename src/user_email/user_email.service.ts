import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEmail } from './user_email.entity';

@Injectable()
export class UserEmailService {
  constructor(
    @InjectRepository(UserEmail)
    private readonly userEmailRepository: Repository<UserEmail>,
  ) {}

  findAll(): Promise<UserEmail[]> {
    return this.userEmailRepository.find();
  }

  create(user_email: Partial<UserEmail>): Promise<UserEmail> {
    return this.userEmailRepository.save<UserEmail>(
      this.userEmailRepository.create(user_email),
    );
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEmail } from './user_email.entity';

@Injectable()
export class UserEmailService {
  constructor(
    @InjectRepository(UserEmail)
    private readonly user_email_repository: Repository<UserEmail>,
  ) {}

  /** Find email by uuid */
  findByUUID(uuid: string): Promise<UserEmail> {
    return this.user_email_repository.findOneOrFail({
      where: uuid,
    });
  }

  /** Return all emails belonging to user_uuid */
  findByUserUUID(user_uuid: string): Promise<UserEmail[]> {
    return this.user_email_repository.find({
      where: { user_uuid },
    });
  }

  /** Return the user_uuid's primary email address */
  findPrimaryEmail(user_uuid: string): Promise<UserEmail> {
    return this.user_email_repository.findOneOrFail({
      where: { user_uuid, primary: true },
    });
  }
  create(user_email: Partial<UserEmail>): Promise<UserEmail> {
    return this.userEmailRepository.save<UserEmail>(
      this.userEmailRepository.create(user_email),
    );
  }
}

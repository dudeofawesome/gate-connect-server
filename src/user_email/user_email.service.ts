import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEmail } from './user_email.entity';
import { RandomString } from 'secure-random-value';

@Injectable()
export class UserEmailService {
  constructor(
    @InjectRepository(UserEmail)
    private readonly user_email_repository: Repository<UserEmail>,
  ) {}

  /** Return all user emails in the database */
  findAll(): Promise<UserEmail[]> {
    return this.user_email_repository.find();
  }

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

  /** Create user_email */
  async create(user_email: Partial<UserEmail>): Promise<UserEmail> {
    return this.user_email_repository.save<UserEmail>(
      this.user_email_repository.create({
        ...user_email,
        verification_token: await RandomString(64),
      }),
    );
  }

  /** Delete email */
  async deleteUserEmail(uuid: string): Promise<void> {
    await this.user_email_repository.delete(uuid);
  }

  /** Update user email  */
  async patch(uuid: string, user_email: Partial<UserEmail>): Promise<void> {
    await this.user_email_repository.update(uuid, user_email);
  }
}

import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEmail } from './user-email.entity';
import { RandomString } from 'secure-random-value';
import { User } from '../user/user.entity';

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
  findByUUID(user_email_uuid: string): Promise<UserEmail> {
    return this.user_email_repository.findOneOrFail({
      where: user_email_uuid,
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
  async create(user_email: Partial<UserEmail>, user: User): Promise<UserEmail> {
    return this.user_email_repository.save<UserEmail>(
      this.user_email_repository.create({
        ...user_email,
        user,
        verification_token: await RandomString(64),
      }),
    );
  }

  /** Delete email */
  async deleteUserEmail(user_email_uuid: string): Promise<void> {
    this.findByUUID(user_email_uuid).then(user_email => {
      // Make sure this email address isn't set to be primary
      if (!user_email.primary) {
        return this.user_email_repository.delete(user_email_uuid);
      } else {
        throw new UnprocessableEntityException('Cannot delete primary emails.');
      }
    });
  }

  /** Update user email  */
  async patch(uuid: string, user_email: Partial<UserEmail>): Promise<void> {
    await this.user_email_repository.update(uuid, user_email);
  }
}

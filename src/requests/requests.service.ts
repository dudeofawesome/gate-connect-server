import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Requests } from './requests.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Requests)
    private readonly requestsRepository: Repository<Requests>,
  ) {}

  findAll(): Promise<Requests[]> {
    return this.requestsRepository.find();
  }

  create(requests: Partial<Requests>): Promise<Requests> {
    return this.requestsRepository.save<Requests>(this.requestsRepository.create(requests));
  }
}

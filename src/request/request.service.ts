import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from './request.entity';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {}

  findAll(): Promise<Request[]> {
    return this.requestRepository.find();
  }

  create(request: Partial<Request>): Promise<Request> {
    return this.requestRepository.save<Request>(this.requestRepository.create(request));
  }
}

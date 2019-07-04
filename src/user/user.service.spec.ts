import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO: This doesn't work right now, and it seems like a redundant test
  // it('should not return duplicates', async () => {
  //   // TODO: get uuid from somewhere
  //   const gate_groups = await service.getGateGroups(
  //     'a5d536dd-e2b5-4cf5-8641-8ad27cb66849',
  //   );
  //   const a = gate_groups.reduce<Map<string, number>>((acc, cur) => {
  //     console.log(cur);
  //     return acc.set(cur.uuid, acc.get(cur.uuid) || 0 + 1);
  //   }, new Map());

  //   return a.values.
  // });
});

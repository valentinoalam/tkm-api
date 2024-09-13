import { Test, TestingModule } from '@nestjs/testing';
import { ItiqafService } from './itiqaf.service';

describe('ItiqafService', () => {
  let service: ItiqafService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItiqafService],
    }).compile();

    service = module.get<ItiqafService>(ItiqafService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

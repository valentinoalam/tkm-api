import { Test, TestingModule } from '@nestjs/testing';

import { UstadzService } from './ustadz.service';

describe('UstadzService', () => {
  let service: UstadzService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UstadzService],
    }).compile();

    service = module.get<UstadzService>(UstadzService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

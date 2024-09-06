import { Test, TestingModule } from '@nestjs/testing';

import { DariAppsheetService } from './dari-appsheet.service';

describe('DariAppsheetService', () => {
  let service: DariAppsheetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DariAppsheetService],
    }).compile();

    service = module.get<DariAppsheetService>(DariAppsheetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { FinancialReportsService } from './financial-reports.service';

describe('FinancialReportsService', () => {
  let service: FinancialReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinancialReportsService],
    }).compile();

    service = module.get<FinancialReportsService>(FinancialReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

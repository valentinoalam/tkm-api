import { Test, TestingModule } from '@nestjs/testing';
import { FinancialReportsController } from './financial-reports.controller';
import { FinancialReportsService } from './financial-reports.service';

describe('FinancialReportsController', () => {
  let controller: FinancialReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialReportsController],
      providers: [FinancialReportsService],
    }).compile();

    controller = module.get<FinancialReportsController>(FinancialReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

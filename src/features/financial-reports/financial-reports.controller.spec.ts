import { Test, TestingModule } from '@nestjs/testing';
import { FinancialReportsController } from './financial-reports.controller';
import { FinancialReportsService } from './financial-reports.service';

describe('FinancialReportsController', () => {
  let controller: FinancialReportsController;
  let service: jest.Mocked<FinancialReportsService>;

  beforeEach(async () => {
    const mockFinancialReportsService = {
      generateBalanceSheet: jest.fn(),
      generateIncomeStatement: jest.fn(),
      generateCashFlowStatement: jest.fn(),
      generateTrialBalance: jest.fn(),
      generateLedger: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialReportsController],
      providers: [
        {
          provide: FinancialReportsService,
          useValue: mockFinancialReportsService,
        },
      ],
    }).compile();

    controller = module.get<FinancialReportsController>(FinancialReportsController);
    service = module.get(FinancialReportsService) as jest.Mocked<FinancialReportsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getBalanceSheet', () => {
    it('should return a balance sheet', async () => {
      const mockDate = '2024-01-01';
      const mockBalanceSheet = {
        assets: [{ accountName: 'Cash', balance: 1000 }],
        liabilities: [{ accountName: 'Accounts Payable', balance: 500 }],
        equity: [{ accountName: 'Retained Earnings', balance: 500 }],
        totalAssets: 1000,
        totalLiabilities: 500,
        totalEquity: 500,
      };

      service.generateBalanceSheet.mockResolvedValue(mockBalanceSheet);

      const result = await controller.getBalanceSheet(mockDate);

      expect(service.generateBalanceSheet).toHaveBeenCalledWith(mockDate);
      expect(result).toEqual(mockBalanceSheet);
    });
  });

  describe('getIncomeStatement', () => {
    it('should return an income statement', async () => {
      const mockStartDate = '2024-01-01';
      const mockEndDate = '2024-12-31';
      const mockIncomeStatement = {
        revenue: [{ category: 'Sales', amount: 1000 }],
        expenses: [{ category: 'Rent', amount: 500 }],
        totalRevenue: 1000,
        totalExpenses: 500,
        netIncome: 500,
      };

      service.generateIncomeStatement.mockResolvedValue(mockIncomeStatement);

      const result = await controller.getIncomeStatement(mockStartDate, mockEndDate);

      expect(service.generateIncomeStatement).toHaveBeenCalledWith(mockStartDate, mockEndDate);
      expect(result).toEqual(mockIncomeStatement);
    });
  });

  describe('getCashFlowStatement', () => {
    it('should return a cash flow statement', async () => {
      const mockStartDate = '2024-01-01';
      const mockEndDate = '2024-12-31';
      const mockCashFlowStatement = {
        operatingActivities: [{ category: 'Sales', amount: 1000 }],
        investingActivities: [],
        financingActivities: [{ category: 'Loan', amount: 500 }],
        netCashFlow: {
          operating: 1000,
          investing: 0,
          financing: 500,
        },
        totalNetCashFlow: 1500,
      };

      service.generateCashFlowStatement.mockResolvedValue(mockCashFlowStatement);

      const result = await controller.getCashFlowStatement(mockStartDate, mockEndDate);

      expect(service.generateCashFlowStatement).toHaveBeenCalledWith(mockStartDate, mockEndDate);
      expect(result).toEqual(mockCashFlowStatement);
    });
  });

  describe('getTrialBalance', () => {
    it('should return a trial balance', async () => {
      const mockDate = '2024-01-01';
      const mockTrialBalance = {
        accounts: [
          { accountId: '1', accountName: 'Cash', accountType: 'Asset', debit: 1000, credit: 0 },
          { accountId: '2', accountName: 'Accounts Payable', accountType: 'Liability', debit: 0, credit: 500 },
        ],
        totalDebits: 1000,
        totalCredits: 500,
      };

      service.generateTrialBalance.mockResolvedValue(mockTrialBalance);

      const result = await controller.getTrialBalance(mockDate);

      expect(service.generateTrialBalance).toHaveBeenCalledWith(mockDate);
      expect(result).toEqual(mockTrialBalance);
    });
  });

  describe('getLedger', () => {
    it('should return a ledger', async () => {
      const mockStartDate = '2024-01-01';
      const mockEndDate = '2024-12-31';
      const mockLedger = {
        '1': {
          accountName: 'Cash',
          accountType: 'Asset',
          entries: [
            { date: new Date('2024-01-15'), description: 'Sale', category: 'Sales', debit: 1000, credit: 0 },
          ],
        },
        '2': {
          accountName: 'Accounts Payable',
          accountType: 'Liability',
          entries: [
            { date: new Date('2024-01-20'), description: 'Bill Payment', category: 'Expenses', debit: 0, credit: 500 },
          ],
        },
      };

      service.generateLedger.mockResolvedValue(mockLedger);

      const result = await controller.getLedger(mockStartDate, mockEndDate);

      expect(service.generateLedger).toHaveBeenCalledWith(mockStartDate, mockEndDate);
      expect(result).toEqual(mockLedger);
    });
  });
});
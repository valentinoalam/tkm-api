import { Test, TestingModule } from '@nestjs/testing';
import { FinancialReportsService } from './financial-reports.service';
import { DatabaseService } from '@/core/database/database.service';
import { AccountType, TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';

// Function to generate fake transactions
function generateFakeTransactions(count: number) {
  const transactions = [];

  for (let i = 0; i < count; i++) {
    const isIncome = faker.datatype.boolean(); // Randomly choose income or expense
    transactions.push({
      id: faker.string.uuid(), // Generate a fake UUID
      activityId: faker.string.uuid(),
      accountId: faker.string.uuid(),
      vendorId: faker.string.uuid(),
      mediaId: faker.string.uuid(),
      programId: faker.string.uuid(),
      type: isIncome ? 'Penerimaan' : 'Pengeluaran', // Randomly assign type
      description: faker.finance.transactionDescription(),
      refCode: faker.finance.account(), // Generate a random reference code
      dtTrx: faker.date.past(), // Random past date
      createdBy: faker.internet.userName(),
      updatedBy: faker.internet.userName(),
      amount: new Decimal(faker.finance.amount()), // Generate random amount using Decimal
    });
  }

  return transactions;
}
// Function to generate a fake account
function generateFakeAccount(hasParent: boolean = false): any {
  const account = {
    id: faker.datatype.uuid(), // Generate a fake UUID
    parentAccountId: hasParent ? faker.datatype.uuid() : null, // Optionally assign a parent
    code: faker.finance.accountNumber(), // Random account code
    name: faker.company.name(), // Random company name for account
    description: faker.lorem.sentence(), // Random description
    type: faker.helpers.arrayElement([AccountType.Asset, AccountType.Liability, AccountType.Equity]), // Randomly select account type
    isDebit: faker.datatype.boolean(), // Randomly true or false
    initialBalance: new Decimal(faker.finance.amount()), // Random initial balance as Decimal
    currentBalance: new Decimal(faker.finance.amount()), // Random current balance as Decimal
    createdAt: faker.date.past(), // Random past date
    updatedAt: faker.date.recent(), // Recent date for updatedAt
    // Parent and children are null or empty arrays for now, can be filled later
    parent: null,
    children: [],
    debitEntries: [], // Empty arrays for relations, you can mock these separately if needed
    creditEntries: [],
    ledger: [],
    BankAccount: [],
    TrialBalanceDetail: [],
    transactions: [],
  };

  return account;
}

// Function to generate multiple fake accounts
function generateFakeAccounts(count: number, includeParent: boolean = false): any[] {
  const accounts = [];

  for (let i = 0; i < count; i++) {
    const account = generateFakeAccount(includeParent);
    accounts.push(account);
  }

  // Optionally, you can assign parent-child relationships after generating all accounts
  if (includeParent) {
    accounts.forEach((account, index) => {
      if (index > 0 && faker.datatype.boolean()) {
        const parentIndex = faker.datatype.number({ min: 0, max: index - 1 });
        account.parentAccountId = accounts[parentIndex].id; // Assign parent
        accounts[parentIndex].children.push(account); // Add as child to parent
      }
    });
  }

  return accounts;
}

describe('FinancialReportsService', () => {
  let service: FinancialReportsService;
  let databaseService: jest.Mocked<DatabaseService>;

  beforeEach(async () => {
    const mockDatabaseService = {
      account: {
        findMany: jest.fn(),
      },
      transaction: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancialReportsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<FinancialReportsService>(FinancialReportsService);
    databaseService = module.get(DatabaseService) as jest.Mocked<DatabaseService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateBalanceSheet', () => {
    it('should generate a balance sheet', async () => {
      const mockDate = new Date('2024-01-01');
      const mockAccounts = generateFakeAccounts(10, true);;

      databaseService.account.findMany.mockResolvedValue(mockAccounts);

      const result = await service.generateBalanceSheet(mockDate);

      expect(result).toEqual({
        assets: [{ accountName: 'Cash', balance: 1300 }],
        liabilities: [{ accountName: 'Accounts Payable', balance: 800 }],
        equity: [{ accountName: 'Retained Earnings', balance: 0 }],
        totalAssets: 1300,
        totalLiabilities: 800,
        totalEquity: 0,
      });
    });
  });

  describe('generateIncomeStatement', () => {
    it('should generate an income statement', async () => {
      const mockStartDate = new Date('2024-01-01');
      const mockEndDate = new Date('2024-12-31');
      const mockTransactions = generateFakeTransactions(10);
      databaseService.transaction.findMany.mockResolvedValue(mockTransactions);

      const result = await service.generateIncomeStatement(mockStartDate, mockEndDate);

      expect(result).toEqual({
        revenue: [{ category: 'Sales', amount: 1000 }],
        expenses: [{ category: 'Rent', amount: 500 }],
        totalRevenue: 1000,
        totalExpenses: 500,
        netIncome: 500,
      });
    });
  });

  describe('generateCashFlowStatement', () => {
    it('should generate a cash flow statement', async () => {
      const mockStartDate = new Date('2024-01-01');
      const mockEndDate = new Date('2024-12-31');
      const mockTransactions = generateFakeTransactions(10);

      databaseService.transaction.findMany.mockResolvedValue(mockTransactions);

      const result = await service.generateCashFlowStatement(mockStartDate, mockEndDate);

      expect(result).toEqual({
        operatingActivities: [
          { category: 'Sales', amount: 1000 },
          { category: 'Loan Payment', amount: 500 },
        ],
        investingActivities: [],
        financingActivities: [],
        netCashFlow: {
          operating: 500,
          investing: 0,
          financing: 0,
        },
        totalNetCashFlow: 500,
      });
    });
  });

  describe('generateTrialBalance', () => {
    it('should generate a trial balance', async () => {
      const mockDate = new Date('2024-01-01');
      const mockAccounts = generateFakeAccounts(10, true);;

      databaseService.account.findMany.mockResolvedValue(mockAccounts);

      const result = await service.generateTrialBalance(mockDate);

      expect(result).toEqual({
        accounts: [
          { accountId: '1', accountName: 'Cash', accountType: AccountType.Asset, debit: 1500, credit: 0 },
          { accountId: '2', accountName: 'Accounts Payable', accountType: AccountType.Liability, debit: 0, credit: 800 },
        ],
        totalDebits: 1500,
        totalCredits: 800,
      });
    });
  });

  describe('generateLedger', () => {
    it('should generate a ledger', async () => {
      const mockStartDate = new Date('2024-01-01');
      const mockEndDate = new Date('2024-12-31');
      const mockTransactions = generateFakeTransactions(10);

      databaseService.transaction.findMany.mockResolvedValue(mockTransactions);

      const result = await service.generateLedger(mockStartDate, mockEndDate);

      expect(result).toEqual({
        '1': {
          accountName: 'Cash',
          accountType: AccountType.Asset,
          entries: [
            {
              date: new Date('2024-01-15'),
              description: 'Sale',
              category: 'Sales',
              debit: 1000,
              credit: 0,
            },
          ],
        },
        '2': {
          accountName: 'Accounts Payable',
          accountType: AccountType.Liability,
          entries: [
            {
              date: new Date('2024-01-20'),
              description: 'Bill Payment',
              category: 'Expenses',
              debit: 0,
              credit: 500,
            },
          ],
        },
      });
    });
  });
});
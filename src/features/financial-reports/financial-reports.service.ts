import { DatabaseService } from '@/core/database/database.service';
import { Injectable } from '@nestjs/common';
import { AccountType, TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class FinancialReportsService {
  constructor(private db: DatabaseService) {}

  async generateBalanceSheet(date: Date) {
    const accountBalances = await this.db.account.findMany({
      where: {
        type: {
          in: [AccountType.Asset, AccountType.Liability, AccountType.Equity]
        }
      },
      select: {
        id: true,
        name: true,
        type: true,
        initialBalance: true,
        transactions: {
          where: {
            dtTrx: {
              lte: date
            }
          },
          select: {
            type: true,
            amount: true
          }
        }
      }
    });

    const balanceSheet = {
      assets: [],
      liabilities: [],
      equity: [],
      totalAssets: 0,
      totalLiabilities: 0,
      totalEquity: 0
    };

    accountBalances.forEach(account => {
      const balance = Number(account.initialBalance) + account.transactions.reduce((sum, trx) => {
        // Convert trx.amount to a number before performing arithmetic
        const amount = (trx.amount instanceof Decimal) ? trx.amount.toNumber() : trx.amount;
        return sum + (trx.type === TransactionType.Penerimaan ? amount : -amount);
      }, 0);

      const item = {
        accountName: account.name,
        balance: balance
      };

      switch (account.type) {
        case AccountType.Asset:
          balanceSheet.assets.push(item);
          balanceSheet.totalAssets += balance;
          break;
        case AccountType.Liability:
          balanceSheet.liabilities.push(item);
          balanceSheet.totalLiabilities += balance;
          break;
        case AccountType.Equity:
          balanceSheet.equity.push(item);
          balanceSheet.totalEquity += balance;
          break;
      }
    });

    // Calculate retained earnings
    const retainedEarnings = await this.calculateRetainedEarnings(date);
    balanceSheet.equity.push({ accountName: 'Retained Earnings', balance: retainedEarnings });
    balanceSheet.totalEquity += retainedEarnings;

    return balanceSheet;
  }

  async generateIncomeStatement(startDate: Date, endDate: Date) {
    const transactions = await this.db.transaction.findMany({
      where: {
        dtTrx: {
          gte: startDate,
          lte: endDate
        },
        account: {
          type: {
            in: [AccountType.Income, AccountType.Expense]
          }
        }
      },
      include: {
        account: true,
        activity: {
          include: {
            category: true
          }
        }
      }
    });

    const incomeStatement = {
      revenue: [],
      expenses: [],
      totalRevenue: 0,
      totalExpenses: 0,
      netIncome: 0
    };

    transactions.forEach(trx => {
      const item = {
        category: trx.activity.category.category || 'Uncategorized',
        amount: Number(trx.amount)
      };

      if (trx.account.type === AccountType.Income) {
        incomeStatement.revenue.push(item);
        incomeStatement.totalRevenue += item.amount;
      } else if (trx.account.type === AccountType.Expense) {
        incomeStatement.expenses.push(item);
        incomeStatement.totalExpenses += item.amount;
      }
    });

    incomeStatement.netIncome = incomeStatement.totalRevenue - incomeStatement.totalExpenses;

    return incomeStatement;
  }

  async generateCashFlowStatement(startDate: Date, endDate: Date) {
    const transactions = await this.db.transaction.findMany({
      where: {
        dtTrx: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        account: true,
        activity: {
          include: {
            category: true
          }
        }
      }
    });

    const cashFlowStatement = {
      operatingActivities: [],
      investingActivities: [],
      financingActivities: [],
      netCashFlow: {
        operating: 0,
        investing: 0,
        financing: 0
      }
    };

    transactions.forEach(trx => {
      const item = {
        category: trx.activity.category?.category || 'Uncategorized',
        amount: Number(trx.amount)
      };

      let section;
      switch (trx.account.type) {
        case AccountType.Asset:
        case AccountType.Liability:
          section = 'operatingActivities';
          cashFlowStatement.netCashFlow.operating += trx.type === TransactionType.Penerimaan ? item.amount : -item.amount;
          break;
        case AccountType.Equity:
          section = 'financingActivities';
          cashFlowStatement.netCashFlow.financing += trx.type === TransactionType.Penerimaan ? item.amount : -item.amount;
          break;
        // Add logic for investing activities if needed
      }

      if (section) {
        cashFlowStatement[section].push(item);
      }
    });

    cashFlowStatement['totalNetCashFlow'] = 
      cashFlowStatement.netCashFlow.operating + 
      cashFlowStatement.netCashFlow.investing + 
      cashFlowStatement.netCashFlow.financing;

    return cashFlowStatement;
  }

  async generateTrialBalance(date: Date) {
    const accounts = await this.db.account.findMany({
      include: {
        transactions: {
          where: {
            dtTrx: {
              lte: date
            }
          }
        }
      }
    });

    const trialBalance = {
      accounts: [],
      totalDebits: 0,
      totalCredits: 0
    };

    accounts.forEach(account => {
      const balance = Number(account.initialBalance) + account.transactions.reduce((sum, trx) => {
        // Convert trx.amount to a number before performing arithmetic
        const amount = (trx.amount instanceof Decimal) ? trx.amount.toNumber() : trx.amount;
        return sum + (trx.type === TransactionType.Penerimaan ? amount : -amount);
      }, 0);

      const item = {
        accountId: account.id,
        accountName: account.name,
        accountType: account.type,
        debit: 0,
        credit: 0
      };

      if (balance > 0) {
        item.debit = balance;
        trialBalance.totalDebits += balance;
      } else {
        item.credit = -balance;
        trialBalance.totalCredits += -balance;
      }

      trialBalance.accounts.push(item);
    });

    return trialBalance;
  }

  private async calculateRetainedEarnings(date: Date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const incomeStatement = await this.generateIncomeStatement(startOfYear, date);
    return incomeStatement.netIncome;
  }

  async generateLedger(startDate: Date, endDate: Date) {
    const transactions = await this.db.transaction.findMany({
      where: {
        dtTrx: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        account: true,
        activity: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        dtTrx: 'asc'
      }
    });

    const ledger = {};

    transactions.forEach(trx => {
      if (!ledger[trx.accountId]) {
        ledger[trx.accountId] = {
          accountName: trx.account.name,
          accountType: trx.account.type,
          entries: []
        };
      }

      ledger[trx.accountId].entries.push({
        date: trx.dtTrx,
        description: trx.description,
        category: trx.activity.category?.category || 'Uncategorized',
        debit: trx.type === TransactionType.Penerimaan ? Number(trx.amount) : 0,
        credit: trx.type === TransactionType.Pengeluaran ? Number(trx.amount) : 0
      });
    });

    return ledger;
  }
}
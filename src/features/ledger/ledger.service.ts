import { Injectable } from '@nestjs/common';
import * as fakeData from 'src/shared/fake-data';

import { CreateLedgerDto } from './dto/create-ledger.dto';
import { UpdateLedgerDto } from './dto/update-ledger.dto';
import { Ledger } from './entities';

import { DatabaseService } from '@/core/database/database.service';

@Injectable()
export class LedgerService {
  constructor(private db: DatabaseService) {}

  async createFakeData(): Promise<Ledger> {
    const fakeLedger = fakeData.fakeLedger(); // Generate 10 fake users

    // Save the fake data to the database using Prisma
    const ledger = await this.db.ledger.create({
      data: fakeLedger,
    });
    return ledger;
  }

  async create(dto: CreateLedgerDto): Promise<Ledger> {
    return this.db.ledger.create({
      data: { ...dto },
    });
  }

  async findAll(): Promise<Ledger[]> {
    return this.db.ledger.findMany();
  }

  async findOne(id: string): Promise<Ledger | null> {
    return this.db.ledger.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateLedgerDto): Promise<Ledger> {
    return this.db.ledger.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Ledger> {
    return this.db.ledger.delete({
      where: { id },
    });
  }

  async createLedger(data: CreateLedgerDto): Promise<Ledger> {
    return this.db.ledger.create({ data });
  }

  async getLedgers(): Promise<Ledger[]> {
    return this.db.ledger.findMany();
  }

  async getLedgerById(id: string): Promise<Ledger | null> {
    return this.db.ledger.findUnique({ where: { id } });
  }

  async updateLedger(id: string, data: UpdateLedgerDto): Promise<Ledger> {
    return this.db.ledger.update({ where: { id }, data });
  }

  async deleteLedger(id: string): Promise<Ledger> {
    return this.db.ledger.delete({ where: { id } });
  }

  async getGeneralLedger(startDate: Date, endDate: Date) {
    // Implement general ledger retrieval logic
  }

  async postToLedger(transactionId: string) {
    // Implement posting to ledger logic
  }
}

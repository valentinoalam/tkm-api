import { Injectable } from '@nestjs/common';
import { CreateLedgerDto } from './dto/create-ledger.dto';
import { UpdateLedgerDto } from './dto/update-ledger.dto';
import { Ledger } from './entities';
import { DatabaseService } from '@/core/database/database.service';
import * as fakeData from 'src/shared/fake-data'; 
@Injectable()
export class LedgerService {
  constructor(private db: DatabaseService) {}

  async createFakeData(): Promise<Ledger> {
    const fakeLedger = fakeData.fakeLedger(); // Generate 10 fake users

    // Save the fake data to the database using Prisma
    let ledger = await this.db.ledger.create({ 
      data: fakeLedger 
    })
    return ledger;
  }

  async create(dto: CreateLedgerDto): Promise<Ledger> {
    return this.db.ledger.create({
      data:{...dto}});
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
}

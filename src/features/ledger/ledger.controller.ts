import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { CreateLedgerDto } from './dto/create-ledger.dto';
import { UpdateLedgerDto } from './dto/update-ledger.dto';
import { LedgerService } from './ledger.service';
import { Ledger } from './entities';

@Controller('ledger')
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get('fake')
  async createFakeData() {
    const dataOut = {
      status: true,
      message: '',
      data: {
        ledger: null,
      },
      logs: {},
    };
    try {
      const ledger = await this.ledgerService.createFakeData();
      dataOut.data.ledger = ledger;
    } catch (error) {
      dataOut.status = false;
      dataOut.message = error.message;
      dataOut.logs = { ...dataOut.logs, error };
    }
    return dataOut;
  }

  @Post()
  create(@Body() createLedgerDto: CreateLedgerDto) {
    return this.ledgerService.create(createLedgerDto);
  }

  @Get()
  findAll() {
    return this.ledgerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ledgerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLedgerDto: UpdateLedgerDto) {
    return this.ledgerService.update(id, updateLedgerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ledgerService.remove(id);
  }
  @Post()
  async createLedger(@Body() data: Ledger): Promise<Ledger> {
    return this.ledgerService.createLedger(data);
  }

  @Get()
  async getLedgers(): Promise<Ledger[]> {
    return this.ledgerService.getLedgers();
  }

  @Get(':id')
  async getLedgerById(@Param('id') id: string): Promise<Ledger | null> {
    return this.ledgerService.getLedgerById(id);
  }

  @Patch(':id')
  async updateLedger(@Param('id') id: string, @Body() data: Ledger): Promise<Ledger> {
    return this.ledgerService.updateLedger(id, data);
  }

  @Delete(':id')
  async deleteLedger(@Param('id') id: string): Promise<Ledger> {
    return this.ledgerService.deleteLedger(id);
  }

  @Get('general-ledger')
  async getGeneralLedger(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.ledgerService.getGeneralLedger(new Date(startDate), new Date(endDate));
  }

  @Post('post-to-ledger/:transactionId')
  async postToLedger(@Param('transactionId') transactionId: string) {
    return this.ledgerService.postToLedger(transactionId);
  }
}

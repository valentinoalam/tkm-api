import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BankService } from './bank.service';
import { CreateBankAccountDto } from './dto';
import { UpdateBankAccountDto } from './dto';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  
  @Get('fake')
  async createFakeData() {
    const dataOut = {
      status: true,
      message: '',
      data: {
        entry: null,
      },
      logs: {},
    };
    try {
      const entry = await this.bankService.createFakeData();
      dataOut.data.entry = entry;
    } catch (error) {
      dataOut.status = false;
      dataOut.message = error.message;
      dataOut.logs = { ...dataOut.logs, error };
    }
    return dataOut;
  }

  @Post()
  create(@Body() createBankDto: CreateBankAccountDto) {
    return this.bankService.create(createBankDto);
  }

  @Get()
  findAll() {
    return this.bankService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBankDto: UpdateBankAccountDto) {
    return this.bankService.update(id, updateBankDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bankService.remove(id);
  }
}

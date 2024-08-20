import { Injectable } from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import * as fakeData from 'src/shared/fake-data'; 
import { DatabaseService } from '@/core/database/database.service';
import { Program } from './entities';
@Injectable()
export class ProgramsService {
  constructor(private db: DatabaseService) {}

  async createFakeData(): Promise<Program> {
    const fakeProgram = fakeData.fakeProgram(); // Generate 10 fake users

    // Save the fake data to the database using Prisma
    let program = await this.db.program.create({ 
      data: fakeProgram 
    })
    return program;
  }

  async create(dto: CreateProgramDto): Promise<Program> {
    return this.db.program.create({
      data:{...dto},
    });
  }

  async findAll(): Promise<Program[]> {
    return this.db.program.findMany();
  }

  async findOne(id: string): Promise<Program | null> {
    return this.db.program.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateProgramDto): Promise<Program> {
    return this.db.program.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Program> {
    return this.db.program.delete({
      where: { id },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import * as fakeData from 'src/shared/fake-data'; 
import { DatabaseService } from '@/core/database/database.service';
import { Tag } from './entities';
@Injectable()
export class TagsService {
  constructor(private db: DatabaseService) {}

  async createFakeData(): Promise<Tag> {
    const fakeTag = fakeData.fakeTag(); // Generate 10 fake users

    // Save the fake data to the database using Prisma
    let tag = await this.db.tag.create({ 
      data: fakeTag 
    })
    return tag;
  }

  async create(dto: CreateTagDto): Promise<Tag> {
    return this.db.tag.create({
      data:{...dto}});
  }

  async findAll(): Promise<Tag[]> {
    return this.db.tag.findMany();
  }

  async findOne(id: string): Promise<Tag | null> {
    return this.db.tag.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateTagDto): Promise<Tag> {
    return this.db.tag.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Tag> {
    return this.db.tag.delete({
      where: { id },
    });
  }
}

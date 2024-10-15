import { Injectable } from '@nestjs/common';
import * as fakeData from 'src/shared/fake-data';

import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities';

import { DatabaseService } from '@/core/database/database.service';

@Injectable()
export class AssetsService {
  constructor(private db: DatabaseService) {}
  async createFakeData(): Promise<Asset> {
    const fakeAsset = fakeData.fakeAsset(); // Generate 10 fake users

    // Save the fake data to the database using Prisma
    const asset = await this.db.asset.create({
      data: fakeAsset,
    });
    return asset;
  }

  async create(dto: CreateAssetDto): Promise<Asset> {
    return this.db.asset.create({
      data: { ...dto },
    });
  }

  async findAll(): Promise<Asset[]> {
    return this.db.asset.findMany();
  }

  async findOne(id: string): Promise<Asset | null> {
    return this.db.asset.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateAssetDto): Promise<Asset> {
    return this.db.asset.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Asset> {
    return this.db.asset.delete({
      where: { id },
    });
  }
}

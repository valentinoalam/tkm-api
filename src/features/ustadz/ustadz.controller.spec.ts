import { Test, TestingModule } from '@nestjs/testing';
import { UstadzController } from './ustadz.controller';
import { UstadzService } from './ustadz.service';

describe('UstadzController', () => {
  let controller: UstadzController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UstadzController],
      providers: [UstadzService],
    }).compile();

    controller = module.get<UstadzController>(UstadzController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

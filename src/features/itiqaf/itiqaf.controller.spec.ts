import { Test, TestingModule } from '@nestjs/testing';
import { ItiqafController } from './itiqaf.controller';
import { ItiqafService } from './itiqaf.service';

describe('ItiqafController', () => {
  let controller: ItiqafController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItiqafController],
      providers: [ItiqafService],
    }).compile();

    controller = module.get<ItiqafController>(ItiqafController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

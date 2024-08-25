import { Test, TestingModule } from '@nestjs/testing';
import { DariAppsheetController } from './dari-appsheet.controller';
import { DariAppsheetService } from './dari-appsheet.service';

describe('DariAppsheetController', () => {
  let controller: DariAppsheetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DariAppsheetController],
      providers: [DariAppsheetService],
    }).compile();

    controller = module.get<DariAppsheetController>(DariAppsheetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

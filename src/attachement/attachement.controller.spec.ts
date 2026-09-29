import { Test, TestingModule } from '@nestjs/testing';
import { AttachementController } from './attachement.controller';
import { AttachementService } from './attachement.service';

describe('AttachementController', () => {
  let controller: AttachementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttachementController],
      providers: [AttachementService],
    }).compile();

    controller = module.get<AttachementController>(AttachementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

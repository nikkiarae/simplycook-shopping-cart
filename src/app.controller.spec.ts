import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return app message', () => {
      expect(appController.getHello()).toBe('SimplyCook Shopping Cart API');
    });

    it('should return health payload', () => {
      expect(appController.getHealth()).toEqual({ status: 'ok' });
    });
  });
});

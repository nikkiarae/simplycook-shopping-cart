import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from '../features/cart/cart.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

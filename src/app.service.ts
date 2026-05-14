import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'SimplyCook Shopping Cart API';
  }

  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}

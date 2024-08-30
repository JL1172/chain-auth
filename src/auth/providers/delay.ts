import { Injectable } from '@nestjs/common';

@Injectable()
export class Delay {
  public async delay(ms: number) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

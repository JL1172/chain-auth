import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SingletonPrisma {
  private static readonly prisma = new PrismaClient();
  public static getInstance(): PrismaClient {
    return this.prisma;
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SingletonPrisma } from 'src/global/provider/singleton-prisma';

@Injectable()
export class AuthPrismaProvider {
  private readonly prisma: PrismaClient;
  constructor() {
    this.prisma = SingletonPrisma.getInstance();
  }
  public async addRegistrationToken(jwt: string) {
    // return await this.prisma.registrationToken.create({data})
  }
}

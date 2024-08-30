import { Injectable } from '@nestjs/common';
import { BlacklistedIp, PrismaClient, WatchListedIp } from '@prisma/client';
import { SingletonPrisma } from 'src/global/provider/singleton-prisma';

@Injectable()
export class AuthPrismaProvider {
  private readonly prisma: PrismaClient;
  constructor() {
    this.prisma = SingletonPrisma.getInstance();
  }
  private async getIpFromWatchlist(ip_address: string) {
    return this.prisma.watchListedIp.findFirst({ where: { ip_address } });
  }
  private async updatedIpAddressFromWatchList(
    updatedWatchlistedIp: WatchListedIp,
  ) {
    await this.prisma.watchListedIp.update({
      where: {
        id: updatedWatchlistedIp.id,
      },
      data: updatedWatchlistedIp,
    });
  }
  private async addIpAddressToWatchlist(ip_address: string) {
    await this.prisma.watchListedIp.create({
      data: { ip_address, violations: 1 },
    });
  }
  public async addIpViolationToWatchList(ip_address: string): Promise<{
    blacklisted: boolean;
  }> {
    const foundIpAddress: WatchListedIp =
      await this.getIpFromWatchlist(ip_address);
    if (foundIpAddress) {
      //todo need to fix this
      if (foundIpAddress.violations + 1 > 5) {
        await this.blackListIp(ip_address);
        return { blacklisted: true };
      } else {
        foundIpAddress.violations += 1;
        await this.updatedIpAddressFromWatchList(foundIpAddress);
        return { blacklisted: false };
      }
    } else {
      await this.addIpAddressToWatchlist(ip_address);
      return { blacklisted: false };
    }
  }
  private async getBlacklistedIp(ip_address: string) {
    return await this.prisma.blacklistedIp.findFirst({ where: { ip_address } });
  }
  public async blackListIp(ip_address: string) {
    await this.prisma.blacklistedIp.create({ data: { ip_address } });
  }
  public async validateIpIsNotBlacklisted(ip_address: string) {
    const blacklistIpAddress: BlacklistedIp =
      await this.getBlacklistedIp(ip_address);
    return blacklistIpAddress ? true : false;
  }
}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthenticationController } from './auth.controller';
import { AuthErrorHandler } from './providers/error';
import { JwtProvider } from './providers/jtw';
import { AuthPrismaProvider } from './providers/prisma';
import {
  RateLimit,
  ValidateIpIsNotBlacklisted,
} from './middleware/register-one';
import { Delay } from './providers/delay';
@Module({
  imports: [],
  controllers: [AuthenticationController],
  providers: [AuthErrorHandler, JwtProvider, AuthPrismaProvider, Delay],
})
export class AuthenticationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimit, ValidateIpIsNotBlacklisted)
      .forRoutes('/auth/register-one');
  }
}

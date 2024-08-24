import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthenticationController } from './auth.controller';
import { ErrorHandler } from './providers/error';
import { JwtProvider } from './providers/jtw';
import { ParseNumber } from './middleware/generate-register-code';
import { AuthPrismaProvider } from './providers/prisma';

@Module({
  imports: [],
  controllers: [AuthenticationController],
  providers: [ErrorHandler, JwtProvider, AuthPrismaProvider],
})
export class AuthenticationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ParseNumber).forRoutes('/auth/generate-register-code/:id');
  }
}

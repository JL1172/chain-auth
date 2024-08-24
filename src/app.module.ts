import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GlobalLogger } from './global/middleware/logger';
import { AuthenticationModule } from './auth/auth.module';

@Module({
  imports: [AuthenticationModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GlobalLogger).forRoutes('*');
  }
}

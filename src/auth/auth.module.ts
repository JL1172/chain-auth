import { Module } from '@nestjs/common';
import { AuthenticationController } from './auth.controller';
import { ErrorHandler } from './providers/error';

@Module({
  imports: [],
  controllers: [AuthenticationController],
  providers: [ErrorHandler],
})
export class AuthenticationModule {}

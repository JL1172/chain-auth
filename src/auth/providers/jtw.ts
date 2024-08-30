import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';

@Injectable()
export class JwtProvider {
  private readonly jwt: typeof jwt = jwt;
}

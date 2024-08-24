import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export enum ExpDate {
  FIFTEEN_MINUTES = '15m',
}

@Injectable()
export class JwtProvider {
  private readonly jwt: typeof jwt = jwt;
  public generateRegistrationJwt(
    exp_date: ExpDate = ExpDate.FIFTEEN_MINUTES,
    company_id: number,
  ): string {
    const payload = { company_id, type: 'Registration Token' };
    const options: jwt.SignOptions = {
      algorithm: 'RS256',
      expiresIn: exp_date,
    };
    console.log(payload);
    console.log(options);
    console.log(process.env.JWT_SECRET);
    const generatedJwt = this.jwt.sign(
      payload,
      process.env.JWT_SECRET + '',
      options,
    );
    return generatedJwt;
  }
}

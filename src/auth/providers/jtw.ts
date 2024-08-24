import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';

export enum ExpDate {
  FIFTEEN_MINUTES = '15m',
}

type DecodedType = {
  company_id: number;
  exp: number;
  iat: number;
  type: string;
};

@Injectable()
export class JwtProvider {
  private readonly jwt: typeof jwt = jwt;

  public generateRegistrationJwt(
    exp_date: ExpDate = ExpDate.FIFTEEN_MINUTES,
    company_id: number,
  ): string {
    const payload = { company_id, type: 'Registration Token' };
    const options: jwt.SignOptions = {
      expiresIn: exp_date,
    };
    return this.jwt.sign(payload, process.env.JWT_SECRET, options);
  }

  public async getExpDate(token: string) {
    const decoded: DecodedType | void = await new Promise((resolve, reject) => {
      this.jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decodedToken: DecodedType) => {
          if (err) {
            reject(err);
          } else {
            resolve(decodedToken);
          }
        },
      );
    });
    return decoded;
  }
}

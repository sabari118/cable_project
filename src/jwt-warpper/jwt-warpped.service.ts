import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JWTWARPPEDSERVICE {
  constructor(private readonly jwt: JwtService) {}

 createToken<T>(payload: T, secret: string, expiresIn?: string) {
    if (expiresIn) {
      return this.jwt.sign(payload as object, { secret});
    }
  }
}
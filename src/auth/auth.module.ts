import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'prisma/prisma.service';
import { JWTWARPPEDSERVICE } from 'src/jwt-warpper/jwt-warpped.service';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from './jwt.strategy';

@Module({
   imports: [
    JwtModule.register({}), 
  ],
  controllers: [AuthController],
  providers: [AuthService,PrismaService,JWTWARPPEDSERVICE,JWTStrategy],
})
export class AuthModule {}

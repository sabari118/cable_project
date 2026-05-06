import { BadRequestException, Injectable } from '@nestjs/common';
import { syncUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Roles_Enum } from 'src/util/common.enum';
import { CONFIG_CONST } from 'src/util/config.const';
import { JWTWARPPEDSERVICE } from 'src/jwt-warpper/jwt-warpped.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma:PrismaService,private readonly jwt:JWTWARPPEDSERVICE){}
    async syncme(SyncUserDto: syncUserDto) {
    
      const findUser=await this.prisma.user.findFirst({where:{Email:SyncUserDto.email}})

      if(findUser){
        throw new BadRequestException('user Already exists')
      }

      const create_user=await this.prisma.user.create({data:{
        name:SyncUserDto.name,
        Email:SyncUserDto.email,
        password:SyncUserDto.password,
        role:{connect:{role_name:Roles_Enum.ROLE_USER}}
      }})

      const payload={
        user_id:create_user.user_id
      }

      const secret_token=process.env.JWT_SECRETUSER || ''

      const Access_TOken=this.jwt.createToken(payload,secret_token,CONFIG_CONST.JWT_EXPIRY_10D)
        
      return {Access_TOken}
      
    }

  async login(syncUserDto:syncUserDto) {
    const findUser = await this.prisma.user.findFirst({where:{Email:syncUserDto.email}})

    if(!findUser){
      throw new BadRequestException("there is no such user need to create user")
    }

    const payload={user_id:findUser.user_id}

    const secret_token=process.env.JWT_SECRETUSER || ""

    const ACCESS_TOKEN=this.jwt.createToken(payload,secret_token,CONFIG_CONST.JWT_EXPIRY_10D)
     const REFRESH_TOKEN=this.jwt.createToken(payload,secret_token,CONFIG_CONST.JWT_EXPIRY_30D)

     return {
      ACCESS_TOKEN,REFRESH_TOKEN
     }
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

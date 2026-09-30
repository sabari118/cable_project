import { BadRequestException, Injectable } from '@nestjs/common';
import { LogInDto, operaterDto, syncOperatorDto, syncUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Roles_Enum } from 'src/util/common.enum';
import { CONFIG_CONST } from '../util/config.const';
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

  async login(logInDto:LogInDto) {
    const findUser = await this.prisma.user.findFirst({where:{Email:logInDto.email}})

    if(!findUser){
      throw new BadRequestException("there is no such user need to create user")
    }

    
   
    
    if(findUser.password !== logInDto.password){
      throw new BadRequestException("password does not match ")
    }

    const payload={user_id:findUser.user_id}

    const secret_token=process.env.JWT_SECRETUSER || ""

    const ACCESS_TOKEN=this.jwt.createToken(payload,secret_token,CONFIG_CONST.JWT_EXPIRY_10D)
     const REFRESH_TOKEN=this.jwt.createToken(payload,secret_token,CONFIG_CONST.JWT_EXPIRY_30D)

     return {
      ACCESS_TOKEN,REFRESH_TOKEN, role: 'user' 
     }
  }

  async syncOperator(dto: syncOperatorDto) {
  const findOperator = await this.prisma.operater.findFirst({ where: { Email: dto.email } })
  if (findOperator) {
    throw new BadRequestException('operator already exists')
  }

  const create_operator = await this.prisma.operater.create({
    data: {
      name: dto.name,
      Email: dto.email,
      password: dto.password,
      role: { connect: { role_name: Roles_Enum.ROLE_OPERATER } }
    }
  })

  const payload = { operator_id: create_operator.operater_id }
  const secret_token = process.env.JWT_SECRETUSER || ''
  const Access_Token = this.jwt.createToken(payload, secret_token, CONFIG_CONST.JWT_EXPIRY_10D)

  return { Access_Token, role: 'operater' }
}

  async homePage(user_id: string) {
    const findMe=await this.prisma.user.findFirst({where:{user_id:user_id},select:{Email:true,name:true,address:true}})

    if(!findMe){
      throw new BadRequestException("user does not exit")
    }

    return {findMe,
      message:"used fetched successfully "
    }
  }


  async operaterLogin(operaterdto: operaterDto) {

  const find_me = await this.prisma.operater.findFirst({
    where: {
      Email: operaterdto.email
    }
  });

  if (!find_me) {
    throw new BadRequestException("operator not found");
  }

  if (find_me.password !== operaterdto.password) {
    throw new BadRequestException("password does not match");
  }

  const payload = {
    user_id: find_me.operater_id
  };

  const secret_token = process.env.JWT_SECRETUSER || "";

  const ACCESS_TOKEN = this.jwt.createToken(
    payload,
    secret_token,
    CONFIG_CONST.JWT_EXPIRY_10D
  );

  const REFRESH_TOKEN = this.jwt.createToken(
    payload,
    secret_token,
    CONFIG_CONST.JWT_EXPIRY_30D
  );

  return {
    
    access_token: ACCESS_TOKEN,
    refresh_token: REFRESH_TOKEN,
    role:'operater'
  };
}
}

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy,ExtractJwt} from "passport-jwt"
import { PrismaService } from "prisma/prisma.service";
import { permission } from "process";
import { Roles_Enum } from "src/util";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy,"jwt"){
constructor(private prisma:PrismaService){
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration:false,
        secretOrKeyProvider: (req:Request,token:string,done:any)=>{
            const roleFromHeader: string=req.headers["role"] as string
            if(roleFromHeader === Roles_Enum.ROLE_USER){
                done(null,process.env.JWT_SECRETUSER)
            }else if(roleFromHeader === Roles_Enum.ROLE_OPERATER){
                done(null,process.env.JWT_SECRETOPERATER)
            }else{
                done(new UnauthorizedException("Invalied role in header"),null)
            }
        },passReqToCallback:true,
    })
}
async validate(req: Request, payload: any){
    if(payload.user_id){
        const findUser=await this.prisma.user.findFirst({
            where:{user_id:payload.user_id},
            include:{
                  address:true,role:{include:{permission:true}}
                  
            }
        })
        if(!findUser){
            throw new UnauthorizedException('user access revoked')
        }
        const user ={
           user_id:findUser.user_id,
            name: findUser.name,
            email: findUser.Email,
            role:{name:findUser.role?.role_name,
              permission:findUser.role?.permission
            },
            address:findUser.address
        }
        return user;
    }else if(payload.operater_id){
        const findOperater=await this.prisma.operater.findFirst({
            where:{operater_id:payload.operater_id},
        include:{
            role:{include:{permission:true}}
        }
    })
    if(!findOperater){
        throw new UnauthorizedException('operater access revoked')
    }

    const operater={
         operater_id: findOperater.operater_id,
        name: findOperater.name,
        email: findOperater.Email,
        role: {name:findOperater.role?.role_name,
          permission:findOperater.role?.permission
        },
    }
    return operater;
    }else{
        throw new UnauthorizedException("token invalied")
    }
    
}
}

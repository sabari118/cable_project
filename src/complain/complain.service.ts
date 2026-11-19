import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateComplainDto, UpdateFeedback } from './dto/create-complain.dto';
import { UpdateComplainDto } from './dto/update-complain.dto';
import { UserDto } from 'src/auth/dto/create-auth.dto';
import { PrismaService } from 'prisma/prisma.service';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { ComplainStatus } from '@prisma/client';

@Injectable()

export class ComplainService {
  constructor(private readonly prisma:PrismaService){}
 async create(createComplainDto: CreateComplainDto,user:UserDto) {
    const find_me= await this.prisma.user.findFirst({where:{user_id:user.user_id}})
    if(!find_me){
      throw new BadRequestException("user not found")
    }

    const create_complain=await this.prisma.complain.create({data:{
      complains:createComplainDto.complains,
      status:createComplainDto.status,
      user:{connect:{user_id:find_me.user_id}}
    }})

    if(!create_complain){
      throw new BadRequestException("complain not created")
    }
    return create_complain;
  }

  async complain_by_user(user:UserDto) { 
    const find_me=await this.prisma.user.findFirst({where:{user_id:user.user_id}})
    if(!find_me){
      throw new BadRequestException("user not found")
    }
    const find_complains= await this.prisma.complain.findMany({
      where: { UserID: user.user_id },select:{complain_id:true,complains:true,feedback:true,status:true,createAt:true},
  orderBy: { createAt: 'desc' },
    })

return find_complains;
}



async updateComplain(complain_id:string,updateFeedback: UpdateFeedback,user:UserDto){
 const findComplain=await this.prisma.complain.findFirst({where:{complain_id,UserID:user.user_id},select:{status:true}})

 if(!findComplain){
  throw new BadRequestException("complain not found")
 }


 if(findComplain.status !== ComplainStatus.COMPLETED){
  throw new BadRequestException("feedback can be added only after the complaint is COMPLETED")
 }
 return  this.prisma.complain.update({
  where:{complain_id},
  data:{feedback:updateFeedback.feedback}
 })
}
}

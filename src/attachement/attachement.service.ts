import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAttachementDto } from './dto/create-attachement.dto';
import { UpdateAttachementDto } from './dto/update-attachement.dto';
import { _FileType } from '../util/common.interceptor';
import { User } from '../auth/dto/create-auth.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Attachement } from './entities/attachement.entity';
import { AwsService } from '../aws/aws.service';

@Injectable()

export class AttachementService {
  constructor( private readonly prisma:PrismaService,private readonly aws:AwsService){}
  async uploadAddress(address_id:string,file:_FileType,{user_id}:User) {
    const findAddress= await this.prisma.address.findFirst({where:{address_id}})

    if(!findAddress){
      throw new BadRequestException('there is no address id ')
    }
console.log("attachement in:1")
    if(file){
      const attachement= await this.prisma.attachemant.create({
        data:{
          url:file.s3Path,
          mime:file.mimetype,
          address:{
            connect:{address_id:findAddress.address_id}
          },
          create_by:{
            connect:{user_id}
          }
        }
      })
    if (attachement) {
      const url = attachement.url ?? "";
      attachement.url = (await this.aws.getS3Url(url, attachement.mime)) ?? "";
    }
    return attachement
    }

    
  }

  findAll() {
    return `This action returns all attachement`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attachement`;
  }

  update(id: number, updateAttachementDto: UpdateAttachementDto) {
    return `This action updates a #${id} attachement`;
  }

  remove(id: number) {
    return `This action removes a #${id} attachement`;
  }
}

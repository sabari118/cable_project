import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from 'prisma/prisma.service';
import { BadRequestError } from 'groq-sdk';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma:PrismaService){}
  create(createChannelDto: CreateChannelDto) {
    return 'This action adds a new channel';
  }

  async findAll() {
    const find_me=await this.prisma.channel.findMany({where:{isActive:true},select:{channel_id:true,name:true,amount:true,logo_path:true}})
    
    return find_me;
  }

  findOne(id: number) {
    return `This action returns a #${id} channel`;
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}

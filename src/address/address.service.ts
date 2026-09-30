import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserDto } from '../auth/dto/create-auth.dto';

@Injectable()
export class AddressService {
  constructor(private readonly prisma:PrismaService){}
  async create(createAddressDto: CreateAddressDto,user:UserDto) {
    const finduser=await this.prisma.user.findFirst({where:{user_id:user.user_id},include:{address:true}})

    if(finduser?.address){
      throw new BadRequestException("user already has address")
    }

    // const attachemant=await this.prisma.attachemant.findMany({where:{attachemant_id:{in:createAddressDto.attachemant_id}}})

    // if(attachemant.length !== createAddressDto.attachemant_id.length){
    //   throw new BadRequestException("one or more attachemant not found")
    // }
    const createAddress= await this.prisma.address.create({data:{
      door_no:createAddressDto.door_no,
      area:createAddressDto.area,
      state:createAddressDto.state,
      street:createAddressDto.street,
      //aadhar_card:{connect:createAddressDto.attachemant_id.map((id)=>({attachemant_id:id}))},
      user:{connect:{user_id:user.user_id}}
    }})

    return createAddress;
    
  }

  findAll() {
    return `This action returns all address`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}

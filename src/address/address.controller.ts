import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiAuthGuard } from 'src/auth/jwt_guard';
import { PermissionGuard } from 'src/auth/permission.guard';
import { ApiBearerAuth, ApiBody, ApiHeader } from '@nestjs/swagger';
import { Permission, Roles_Enum } from 'src/util';
import { CurrentUser, Permisssions } from 'src/decorator';
import { UserDto } from 'src/auth/dto/create-auth.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(ApiAuthGuard,PermissionGuard)
  @ApiBearerAuth()
  @Permisssions(Permission.USER_PERMISSION)
  @ApiHeader({name:'role',enum:[Roles_Enum.ROLE_USER]})
  @Post()
  @ApiBody({type:CreateAddressDto})
  create(@Body() createAddressDto: CreateAddressDto,@CurrentUser() user:UserDto) {
    return this.addressService.create(createAddressDto, user);
  }

  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CurrentUser } from 'src/decorator/currentUser';
import { UserDto } from 'src/auth/dto/create-auth.dto';
import { ApiBearerAuth, ApiBody, ApiHeader } from '@nestjs/swagger';
import { ApiAuthGuard } from 'src/auth/jwt_guard';
import { PermissionGuard } from 'src/auth/permission.guard';
import { Roles_Enum } from 'src/util/common.enum';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(ApiAuthGuard,PermissionGuard)
  @ApiBearerAuth()
  @ApiHeader({name:'role',enum:[Roles_Enum.ROLE_USER]})
  @Post()
  @ApiBody({type:CreateOrderDto})
  async createOrders(@Body('channelId') channelId:string[], @CurrentUser() user:UserDto) {
    return this.orderService.create(channelId,user);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}

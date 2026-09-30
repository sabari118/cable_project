import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, VerifyPaymentDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CurrentUser } from '../decorator/currentUser';
import { UserDto } from '../auth/dto/create-auth.dto';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { ApiAuthGuard } from '../auth/jwt_guard';
import { PermissionGuard } from '../auth/permission.guard';
import { Roles_Enum } from '../util/common.enum';
import { Permission } from '../util';
import { Permisssions } from '../decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(ApiAuthGuard,PermissionGuard)
  @ApiBearerAuth()
  @ApiHeader({name:'role',enum:[Roles_Enum.ROLE_USER]})
  @Permisssions(Permission.USER_PERMISSION)
  @Post()
  @ApiBody({type:CreateOrderDto})
  async createOrders(@Body('channelId') channelId:string[], @CurrentUser() user:UserDto) {
    return this.orderService.create(channelId,user);
  }
@ApiOperation({ summary: "verify razorpay payment" })
@UseGuards(ApiAuthGuard, PermissionGuard)
@ApiBearerAuth()
@ApiHeader({ name: 'role', enum: [Roles_Enum.ROLE_USER,Roles_Enum.ROLE_OPERATER] })
@Permisssions(Permission.USER_PERMISSION)
@Post('verify')
@ApiBody({ type: VerifyPaymentDto })
async verifyPayment(@Body() dto: VerifyPaymentDto, @CurrentUser() user: UserDto) {
  return this.orderService.verifyPayment(dto, user);
}
  
  @ApiOperation({summary:"get all orders"})
  @UseGuards(ApiAuthGuard,PermissionGuard)
  @ApiBearerAuth()
  @ApiHeader({name:'role',enum:[Roles_Enum.ROLE_USER,Roles_Enum.ROLE_OPERATER]})
  @Permisssions(Permission.USER_PERMISSION,Permission.OPERATER_PERMISSION)
  @Get('AllOders')
  async findAll() {
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

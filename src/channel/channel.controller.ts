import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ApiBearerAuth, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { ApiAuthGuard } from '../auth/jwt_guard';
import { PermissionGuard } from '../auth/permission.guard';
import { Permisssions } from '../decorator/permission.decorator';
import { Permission } from '../util/permission.common';
import { Roles_Enum } from '../util/common.enum';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto);
  }
  @ApiOperation({summary:"get all channel"})
  @ApiBearerAuth()
  @Permisssions(Permission.USER_PERMISSION)
  @ApiHeader({name:'role',enum:[Roles_Enum.ROLE_USER,Roles_Enum.ROLE_OPERATER]})
  @UseGuards(ApiAuthGuard,PermissionGuard)
  @Get()
  findAll() {
    return this.channelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(+id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelService.remove(+id);
  }
}

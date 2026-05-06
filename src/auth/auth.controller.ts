import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { syncUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiAuthGuard } from './jwt_guard';
import { ApiBearerAuth, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { permission } from 'process';
import { Permisssions } from 'src/decorator';
import { USER_PERMISSION } from 'src/util/permission.common';
import { PermissionGuard } from './permission.guard';
import { Roles_Enum } from 'src/util/common.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
 
@ApiOperation({summary:"syncUser"})
@Permisssions(USER_PERMISSION)
  @Post()
  syncUser(@Body() syncUserDto: syncUserDto) {
    return this.authService.syncme(syncUserDto);
  }

  //@UseGuards(ApiAuthGuard,PermissionGuard)
  //@ApiBearerAuth()
  @ApiOperation({summary:"login"})
  //@Permisssions(USER_PERMISSION)
  //@ApiHeader({name:'role',enum:[Roles_Enum.ROLE_USER]})
  @Post("user/login")
  async create(@Body() syncUserDto: syncUserDto) {
    return this.authService.login(syncUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}

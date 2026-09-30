import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto, syncUserDto, syncOperatorDto, operaterDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiAuthGuard } from './jwt_guard';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { permission } from 'process';
import { CurrentUser, Permisssions } from '../decorator';
import { Permission} from '../util/permission.common';
import { PermissionGuard } from './permission.guard';
import { Roles_Enum } from '../util/common.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
 
@ApiOperation({summary:"syncUser"})
@Permisssions(Permission.USER_PERMISSION)
  @Post('register/user')
  syncUser(@Body() syncUserDto: syncUserDto) {
    return this.authService.syncme(syncUserDto);
  }

  //@UseGuards(ApiAuthGuard,PermissionGuard)
  //@ApiBearerAuth()
  @ApiOperation({summary:"login"})
  //@Permisssions(USER_PERMISSION)
  //@ApiHeader({name:'role',enum:[Roles_Enum.ROLE_USER]})
  @Post("user/login")
  async create(@Body() logInDto: LogInDto) {
    return this.authService.login(logInDto);
  }

  @ApiOperation({ summary: "syncOperator" })
@Permisssions(Permission.OPERATER_PERMISSION,Permission.USER_PERMISSION)
@Post('register/operater')
syncOperator(@Body() syncOperatorDto: syncOperatorDto) {
  return this.authService.syncOperator(syncOperatorDto);
}


@ApiOperation({summary:"operater_login"})
@Post('operater/login')
async  operaterLogin(@Body()operaterdto:operaterDto ){
  return this.authService.operaterLogin(operaterdto)
}


@ApiOperation({ summary: "get current user's homepage data" })
@UseGuards(ApiAuthGuard, PermissionGuard)     
@ApiBearerAuth()    
@ApiHeader({name:'role',enum:[Roles_Enum.ROLE_USER,Roles_Enum.ROLE_OPERATER]})
  @Get('homepage')
  findOne(@CurrentUser() user: any) {
    return this.authService.homePage(user.user_id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { ComplainService } from './complain.service';
import { CreateComplainDto, UpdateFeedback } from './dto/create-complain.dto';
import { UpdateComplainDto } from './dto/update-complain.dto';
import { ApiBearerAuth, ApiOperation,ApiHeader, ApiProperty } from '@nestjs/swagger';
import { PermissionGuard } from 'src/auth/permission.guard';
import { ApiAuthGuard } from 'src/auth/jwt_guard';
import { CurrentUser, Permisssions } from 'src/decorator';
import { Permission, Roles_Enum } from 'src/util';
import { UserDto } from 'src/auth/dto/create-auth.dto';

@Controller('complain')
export class ComplainController {
  constructor(private readonly complainService: ComplainService) {}

  @ApiOperation({ summary: "complains" })
  @UseGuards(ApiAuthGuard,PermissionGuard)
  @ApiBearerAuth()
  @Permisssions(Permission.USER_PERMISSION)
  @ApiHeader({name:"role",enum:[Roles_Enum.ROLE_USER]})
  @Post('create/complaines')
  async create(@Body() createComplainDto: CreateComplainDto, @CurrentUser() user:UserDto) {
    return this.complainService.create(createComplainDto,user);
  }


@ApiOperation({summary:"get all complains"})
@UseGuards(ApiAuthGuard,PermissionGuard)
@ApiBearerAuth()
@Permisssions(Permission.USER_PERMISSION,Permission.OPERATER_PERMISSION)
@ApiHeader({name:"role",enum:[Roles_Enum.ROLE_USER,Roles_Enum.ROLE_OPERATER]})
  @Get('view/complains')
  async findAll(@CurrentUser() user:UserDto) {
    return this.complainService.complain_by_user(user);
  }






  @ApiOperation({summary:"edit_complains"})
  @UseGuards(ApiAuthGuard,PermissionGuard)
  @ApiBearerAuth()
  @Permisssions(Permission.USER_PERMISSION)
  @ApiHeader({name:'role',enum:[Roles_Enum.ROLE_USER]})
  @Put('feedback/:complain_id')
  async updateComplain(
    @Param('complain_id') complain_id:string, 
    @Body() updateFeedback: UpdateFeedback,
  @CurrentUser() user:UserDto ){
      return this.complainService.updateComplain(complain_id,updateFeedback,user)
  }
}

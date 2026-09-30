import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AttachementService } from './attachement.service';
import { UpdateAttachementDto } from './dto/update-attachement.dto';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { Roles_Enum } from '../util/common.enum';
import { PermissionGuard } from '../auth/permission.guard';
import { ApiAuthGuard } from '../auth/jwt_guard';
import { Permisssions } from '../decorator/permission.decorator';
import { Permission } from '../util/permission.common';
import { S3Interceptor } from '../util/interceptors/s3.interceptor';
import * as commonInterceptor from '../util/common.interceptor';
import { CurrentUser } from '../decorator';
import * as client from '@prisma/client';
import { User } from '../auth/dto/create-auth.dto';
import { FileInterceptor} from '@nestjs/platform-express';

@Controller('attachement')
export class AttachementController {
  constructor(private readonly attachementService: AttachementService) {}

  @UseGuards(ApiAuthGuard,PermissionGuard)
  @ApiBearerAuth()
  @ApiHeader({
    name:'role',
    enum:[Roles_Enum.ROLE_USER,],
    required:true
  })
  @Permisssions(Permission.USER_PERMISSION)
  @UseInterceptors(FileInterceptor('file'),S3Interceptor('aadhar_card'))
  @ApiConsumes('multipart/form-data')
 @ApiParam({                         
  name: 'address_id',
  description: 'The address ID to attach this file to',
  type: String,
})
@ApiBody({
  description: "upload file",
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary'
      }
    }
  }
})
  @Post(':address_id')
  create(@Param('address_id') address_id:string,
    @UploadedFile() file:commonInterceptor._FileType,
    @CurrentUser() user:User
  ) {

    if(!file){
      throw new BadRequestException("File should not be empty")
    }

    return this.attachementService.uploadAddress(address_id,file,user);
  }

  @Get()
  findAll() {
    return this.attachementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attachementService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttachementDto: UpdateAttachementDto) {
    return this.attachementService.update(+id, updateAttachementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attachementService.remove(+id);
  }
}

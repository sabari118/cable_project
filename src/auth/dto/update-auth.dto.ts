import { PartialType } from '@nestjs/mapped-types';
import { syncUserDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(syncUserDto) {}

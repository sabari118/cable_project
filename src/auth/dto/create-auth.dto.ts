import { ApiProperty } from "@nestjs/swagger";
import {IsString} from "class-validator"

export class syncUserDto {

    @ApiProperty({example:"sabari"})
    @IsString()
    name!:string

    @ApiProperty({example:"example@gmail.com"})
    @IsString()
    email!:string

    @ApiProperty({example:"1234567"})
    @IsString()
    password!:string
}

export class UserDto{
    @ApiProperty({example:"oiuytfcvbnjky"})
    user_id!:string
    @ApiProperty({example:"oiuytfcvbnjky"})
    name!:string
    @ApiProperty({example:"oiuytfcvbnjky"})
    email!:string
}

import { ApiProperty } from "@nestjs/swagger";
import {IsEnum, IsString} from "class-validator"
import { Roles_Enum } from "../../util";

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

export class LogInDto{

    @ApiProperty({example:"example@gmail.com"})
    @IsString()
    email!:string

    @ApiProperty({example:"1234567"})
    @IsString()
    password!:string
}

export class operaterDto{
    @ApiProperty({example:"example@gmail.com"})
    @IsString()
    email!:string

    @ApiProperty({example:"1234567"})
    @IsString()
    password!:string
}


export class syncOperatorDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  name!: string

  @ApiProperty({ example: 'jane@example.com' })
  @IsString()
  email!: string

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  password!: string
}

// export class AddressDto{
//      @ApiProperty({example:"5/34"})
//     @IsString()
//     door_no!:String;
//       @ApiProperty({example:"west"})
//     @IsString()
//   area!:String 
//     @ApiProperty({example:"east street"})
//     @IsString()
//   street!: String 
//     @ApiProperty({example:"tamil nadu"})
//     @IsString()
//   state!: String 
//     @ApiProperty({example:"1234567"})
//     @IsString()
//   aadher_card!: Attachemant?
// }


export class UserDto{
    @ApiProperty({example:"oiuytfcvbnjky"})
    user_id!:string
    @ApiProperty({example:"oiuytfcvbnjky"})
    name!:string
    @ApiProperty({example:"oiuytfcvbnjky"})
    email!:string
}

export class User {
    @ApiProperty({example:"ckzb8l1al0001v6hdb8mepq4g"})
       @IsString()
    user_id! :string

     @ApiProperty({example:"sabari"})
    @IsString()
    name!:string

    @ApiProperty({example:"123456"})
    @IsString() 
    password!:String

    @ApiProperty({example:"sabari@gmail.com"})
    @IsString()
    Email!:string
}


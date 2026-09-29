import { ApiProperty } from "@nestjs/swagger";
import { IsString, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';
import { Attachemant } from "@prisma/client";


// export class AttachmentDto {
//   @ApiProperty({ example: "https://s3.amazonaws.com/aadhaar-front.jpg" })
//   @IsString()
//   url!: string;

//   @ApiProperty({ example: "image/jpeg" })
//   @IsString()
//   mime!: string;
// }


export class CreateAddressDto {

 
    @ApiProperty({example:''})
    @IsString()
    door_no!:string

    @ApiProperty({example:'first area'})
    @IsString()
    area!:string

    @ApiProperty({example:'east street'})
    @IsString()
    street!:string

    @ApiProperty({example:'east street'})
    @IsString()
    state!:string


    // @ApiProperty({type:AttachmentDto})
    // @ValidateNested()
    // @Type(()=>AttachmentDto)
    // aadhar_card!:AttachmentDto
}

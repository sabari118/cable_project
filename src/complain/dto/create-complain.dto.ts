import { ApiProperty } from "@nestjs/swagger";
import { ComplainStatus } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";


export class CreateComplainDto {

    @ApiProperty({example:"i get connection fail"})
    @IsString()
    complains!:string

    @ApiProperty({enum:ComplainStatus,example:ComplainStatus.PENDING})
    @IsEnum(ComplainStatus)
    status!:ComplainStatus
  
}

export class UpdateFeedback{
   

    @ApiProperty({enum:ComplainStatus,example:ComplainStatus.PENDING})
    @IsEnum(ComplainStatus)
    status!:ComplainStatus
    
   @ApiProperty({example:"good"})
   @IsString()
   feedback!:string
}

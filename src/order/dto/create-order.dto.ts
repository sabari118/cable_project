import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsString } from "class-validator";

export class CreateOrderDto {

    @ApiProperty({example:"wertyhgbfvdcwefrgthy"})
    @ArrayNotEmpty()
    @IsString()
    channelId!: string[];
}






import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsString } from "class-validator";

export class CreateOrderDto {

    @ApiProperty({example:"wertyhgbfvdcwefrgthy"})
    @ArrayNotEmpty()
    @IsString()
    channelId!: string[];
}





export class VerifyPaymentDto {
  @ApiProperty()
  @IsString()
  razorpay_order_id!: string;

  @ApiProperty()
  @IsString()
  razorpay_payment_id!: string;

  @ApiProperty()
  @IsString()
  razorpay_signature!: string;
}


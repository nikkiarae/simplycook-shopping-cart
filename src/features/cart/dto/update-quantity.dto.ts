import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateQuantityDto {
  @ApiProperty({
    example: 3,
    minimum: 0,
    description: 'New quantity. Setting to 0 removes the item from the cart.',
  })
  @IsInt()
  @Min(0)
  quantity!: number;
}

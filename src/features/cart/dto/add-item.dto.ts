import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class MetadataDto {
  @ApiProperty({ example: 'Tomato Pasta Recipe Kit' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'A delicious tomato pasta kit.' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class AddItemDto {
  @ApiProperty({ example: 101, minimum: 1 })
  @IsInt()
  @Min(1)
  productId!: number;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiProperty({
    example: 4.99,
    minimum: 0,
    description: 'Unit price (currency-agnostic in this exercise).',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice!: number;

  @ApiProperty({ type: () => MetadataDto })
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata!: MetadataDto;
}

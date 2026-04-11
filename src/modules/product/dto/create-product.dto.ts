import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsUUID,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductSpecDto {
  @IsString()
  title!: string;

  @IsString()
  value!: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  url!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  images!: string[];

  @IsUUID('4')
  categoryId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSpecDto)
  characteristics!: ProductSpecDto[];

  @IsOptional()
  warehouseIds!: string[];
}

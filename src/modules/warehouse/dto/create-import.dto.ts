// src/imports/dto/create-import.dto.ts
import {
  IsArray,
  IsNotEmpty,
  ValidateNested,
  IsString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ImportProductItemDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsNumber()
  @IsNotEmpty()
  quantity!: number; // changed to number (supports + and -)
}

export class CreateImportDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportProductItemDto)
  products!: ImportProductItemDto[];
}

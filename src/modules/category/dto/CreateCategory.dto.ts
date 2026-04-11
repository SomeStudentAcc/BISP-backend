// create-category.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class ImagesDto {
  @IsString()
  name: string;

  @IsString()
  url: string;
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsArray()
  image: ImagesDto[] | [];

  @IsString()
  @IsOptional()
  existingImage?: string; // Connect existing characteristics
}

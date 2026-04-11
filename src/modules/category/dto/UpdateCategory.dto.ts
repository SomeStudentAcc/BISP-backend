import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto, ImagesDto } from './CreateCategory.dto';
import { IsArray, IsOptional } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional() // optional for updates
  @IsArray()
  image?: ImagesDto[];
}

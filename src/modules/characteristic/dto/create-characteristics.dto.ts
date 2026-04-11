import { IsOptional, IsString } from 'class-validator';

export class CretaeCharacteristicsDto {
  @IsString()
  title: string;

  @IsString()
  value: string;

  @IsString()
  productId: string;

  @IsString()
  @IsOptional()
  id?: string;
}

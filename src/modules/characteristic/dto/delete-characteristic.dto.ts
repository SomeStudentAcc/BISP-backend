import { PartialType } from '@nestjs/mapped-types';
import { CretaeCharacteristicsDto } from './create-characteristics.dto';

export class DeleteCharacteristicsDto extends PartialType(
  CretaeCharacteristicsDto,
) {}

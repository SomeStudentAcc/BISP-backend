import { IsString } from 'class-validator';

export class DeleteDillerDto {
  @IsString()
  id: string;

  @IsString()
  companyId: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDillerDto {
  @IsString()
  name!: string;

  @IsString()
  phone!: string;

  @IsString()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

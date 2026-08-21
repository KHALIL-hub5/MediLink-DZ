import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSpecialtyDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;


  @IsOptional()
  @IsString()
  description?: string;

}
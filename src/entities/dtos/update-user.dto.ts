import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;
}

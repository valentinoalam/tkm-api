import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

import { CreateUserDto } from '@/features/users/dto';

export class SignupDto extends CreateUserDto {}

export class SigninDto {
  @ApiPropertyOptional({
    description: 'Username anda',
    example: 'Armin',
  })
  @IsString()
  @IsOptional()
  username: string;
  @ApiPropertyOptional({
    description: 'Email anda',
    example: 'admin01@dsn.id',
  })
  @IsEmail()
  @IsOptional()
  email: string;
  @ApiProperty({ description: 'Masukan password', example: '12345678' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

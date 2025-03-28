import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/entities/users/users.entity';

export class SignupDTOResponse {
  @ApiProperty({example:"Login Successfull"})
  @IsString()
  @IsNotEmpty()
  readonly message: string;

  @ApiProperty({example:"200"})
  @IsString()
  @IsNotEmpty()
  readonly code: number;
}





import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/entities/users/users.entity';
import { ServiceProviders } from 'src/entities/service-provider/ServiceProviders.entity';

export class LoginDto {
  @ApiProperty({example:"salvatore@sasy.com"})
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({example:"Sasy"})
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class LoginDTOResponse{
  @IsString()
  @ApiProperty()
  readonly accessToken :string;

  @ApiProperty()
  readonly user: Partial<User> & {
    provider_info?: Partial<ServiceProviders>;
  }
}


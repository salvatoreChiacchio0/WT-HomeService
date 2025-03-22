import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDTOResponse } from 'src/DTO/login-dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<LoginDTOResponse> {
    const user = await this.usersService.findOne(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.user_id, email: user.email };
    const { password,created_at, ...result } = user; // rimossa la psw dalla rissposta
    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: result
    };
  }
}

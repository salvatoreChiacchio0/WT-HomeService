import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDTOResponse } from 'src/DTO/login-dto';
import { User, Role } from 'src/entities/users/users.entity';
import { SignupDTOResponse } from 'src/DTO/signup-dto';
import { ServiceProviderService } from '../service-provider/service-providers.service';
import { ServiceProviders } from 'src/entities/service-provider/ServiceProvider.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private serviceProviderService: ServiceProviderService
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<LoginDTOResponse> {
    const user = await this.usersService.findOne(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.user_id, email: user.email, role: user.role }; 
    const { password, created_at, ...result } = user;

    // If user is a provider, get their provider information
    let providerInfo: Partial<ServiceProviders> | undefined = undefined;
    if (user.role == Role.Provider) {
      const provider = await this.serviceProviderService.findByUserId(user.user_id);
      console.log(provider,user.user_id)
      if (provider) {
        providerInfo = provider;
      }
    }
    console.log(providerInfo)
    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        ...result,
        provider_info: providerInfo
      }
    };
  }

  async signUp(userData: any): Promise<SignupDTOResponse> {
    try {
      // Handle profile image if present
      if (userData.profile_photo) {
        // Convert the file to base64
        const base64Image = userData.profile_photo.toString('base64');
        userData.profile_image = `data:image/jpeg;base64,${base64Image}`;
      }

      // Create the user first
      const newUser = await this.usersService.create(userData);
      if (!newUser) {
        throw new Error(`User not created`);
      }

      // If user is a provider, create provider information
      if (userData.role === Role.Provider) {
        const providerData: Partial<ServiceProviders> = {
          user_id: newUser.user_id,
          name: `${userData.first_name} ${userData.last_name}`,
          experience_years: parseInt(userData.experience_years) || 0,
          availability: userData.availability,
          pricing_model: userData.pricing_model,
        };

        // Create the provider record
        const provider = await this.serviceProviderService.create(providerData);
      }

      return {
        message: "User created successfully",
        code: 201
      };
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
}

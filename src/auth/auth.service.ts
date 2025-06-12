import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDTOResponse } from 'src/DTO/login-dto';
import { User, Role } from 'src/entities/users/users.entity';
import { SignupDTOResponse } from 'src/DTO/signup-dto';
import { ServiceProvidersService } from '../service-provider/service-providers.service';
import { ServiceProviders } from 'src/entities/service-provider/ServiceProviders.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private serviceProviderService: ServiceProvidersService
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<LoginDTOResponse> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.password !== password) {
      throw new Error('Invalid password');
    }

    let providerInfo: Partial<ServiceProviders> | undefined = undefined;
    if (user.role == Role.Provider) {
      const provider = await this.serviceProviderService.findByUserId(user.user_id);
      if (provider) {
        providerInfo = {
          provider_id: provider.provider_id,
          user_id: user.user_id,
        };
      } else {
        const providerData = {
          user_id: user.user_id,
        };
        const provider = await this.serviceProviderService.create(providerData);
        providerInfo = {
          provider_id: provider.provider_id,
          user_id: user.user_id,
        };
      }
    }

    const payload = { username: user.username, sub: user.user_id };
    return {
      accessToken: await this.jwtService.sign(payload),
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        provider_info: providerInfo
      },
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

      console.log("here")
      // If user is a provider, create provider information
      if (userData.role === Role.Provider) {
        const providerData: Partial<ServiceProviders> = {
          user_id: newUser.user_id,
          name: `${userData.first_name} ${userData.last_name}`,
          experience_years: parseInt(userData.experience_years) || 0,
          availability: userData.availability,
          pricing_model: userData.pricing_model,
          service_categories: userData.serviceCategories ? JSON.parse(userData.serviceCategories) : [],
          hourly_rate: userData.hourly_rate ? parseFloat(userData.hourly_rate) : null
        };

        // Create the provider record
        const provider = await this.serviceProviderService.create(providerData);
      }
      console.log("here2")

      return {
        message: "User created successfully",
        code: 201
      };
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
}

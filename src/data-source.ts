import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ServiceProviders } from "./entities/service-provider/ServiceProviders.entity";
import { User } from "./entities/users/users.entity";
import { Service } from "./entities/services/services.entity";
import { Booking } from "./entities/bookings/bookings.entity";
import { Review } from "./entities/reviews/reviews.entity";
import { ProviderImage } from "./entities/service-provider/ProviderImage.entity";
import { ProviderCertificate } from "./entities/service-provider/ProviderCertificate.entity";
import { ProviderAvailability } from "./entities/service-provider/ProviderAvailability.entity";
import { AdminReports } from "./entities/admin-reports/admin_reports.entity";

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'HomeService',
  synchronize: true,
  logging: true,
  entities: [
    User,
    ServiceProviders,
    Service,
    Booking,
    Review,
    ProviderImage,
    ProviderCertificate,
    ProviderAvailability,
    AdminReports
  ],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
}); 
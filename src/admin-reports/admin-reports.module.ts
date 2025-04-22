import { Module } from '@nestjs/common';
import { AdminReportsService } from './admin-reports.service';
import { AdminReportsController } from './admin-reports.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/roles/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminReports } from 'src/entities/admin-reports/admin_reports.entity';

@Module({
  imports:[TypeOrmModule.forFeature([AdminReports])],
  providers: [AdminReportsService,{
    provide: APP_GUARD,
    useClass: RolesGuard,
  },],
  controllers: [AdminReportsController]
})
export class AdminReportsModule {}

import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminReports } from '../entities/admin-reports/admin_reports.entity';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('reports')
    findAllReports(): Promise<AdminReports[]> {
        return this.adminService.findAllReports();
    }

    @Get('reports/:id')
    findOneReport(@Param('id') id: number): Promise<AdminReports> {
        return this.adminService.findOneReport(id);
    }

    @Post('reports')
    createReport(@Body() report: AdminReports): Promise<AdminReports> {
        return this.adminService.createReport(report);
    }

    @Put('reports/:id')
    updateReport(@Param('id') id: number, @Body() report: AdminReports): Promise<AdminReports> {
        return this.adminService.updateReport(id, report);
    }

    @Delete('reports/:id')
    removeReport(@Param('id') id: number): Promise<void> {
        return this.adminService.removeReport(id);
    }
} 
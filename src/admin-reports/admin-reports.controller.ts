import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/role.decorator';
import { CreateReportDto } from 'src/DTO/report-dto';
import { Role } from 'src/entities/users/users.entity';
import { AdminReportsService } from './admin-reports.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminReports } from 'src/entities/admin-reports/admin_reports.entity';

@Controller('admin-reports')
@ApiBearerAuth()
export class AdminReportsController {

    constructor(private readonly reportService: AdminReportsService) {}
  
    @Post()
    @Roles(Role.Admin)
    create(@Body() createReport: AdminReports) {
        this.reportService.create(createReport)
    }

      
  @Get()
  findAll() {
    return this.reportService.findAll();
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() report: Partial<AdminReports>) {
    return this.reportService.update(+id, report);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportService.delete(+id);
  }
  @Get('user/:id')
  findAllReportFromUser(@Param('id') id: number) {
    return this.reportService.findAllFromUser(id);
  }
}

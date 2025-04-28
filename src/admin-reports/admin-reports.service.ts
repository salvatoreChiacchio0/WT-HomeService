import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from 'src/DTO/report-dto';
import { AdminReports } from 'src/entities/admin-reports/admin_reports.entity';
import { User } from 'src/entities/users/users.entity';
import { Admin, Repository } from 'typeorm';

@Injectable()
export class AdminReportsService {
  constructor(
    @InjectRepository(AdminReports)
    private readonly adminReportsRepository: Repository<AdminReports>,
  ) {}


      async create(user: AdminReports): Promise<AdminReports> {
        this.adminReportsRepository.create(user);
        return this.adminReportsRepository.save(user);
      }
      async findAll(): Promise<AdminReports[]> {
        return this.adminReportsRepository.find();
      }
      async findAllFromUser(id: number): Promise<AdminReports[]> {
        return this.adminReportsRepository.find({ where: { admin_id: id } });
      }
    
      async update(id: number, report: Partial<AdminReports>): Promise<AdminReports> {
        await this.adminReportsRepository.update(id, report);
        return this.findOne(report.report_id);
      }
    
      async delete(id: number): Promise<void> {
        await this.adminReportsRepository.delete(id);
      }
      
      
        async findOne(id:number | undefined): Promise<AdminReports> {
          const user = await this.adminReportsRepository.findOneBy({ report_id:id });
          if (!user) {
            throw new Error(`Report not found`);
          }
          return user;
        }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminReports } from '../entities/admin-reports/admin_reports.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(AdminReports)
        private adminReportsRepository: Repository<AdminReports>,
    ) {}

    findAllReports(): Promise<AdminReports[]> {
        return this.adminReportsRepository.find();
    }

    async findOneReport(id: number): Promise<AdminReports> {
        const report = await this.adminReportsRepository.findOne({ where: { report_id: id } });
        if (!report) {
            throw new NotFoundException(`Report with ID ${id} not found`);
        }
        return report;
    }

    createReport(report: AdminReports): Promise<AdminReports> {
        return this.adminReportsRepository.save(report);
    }

    async updateReport(id: number, report: AdminReports): Promise<AdminReports> {
        await this.findOneReport(id);
        await this.adminReportsRepository.update(id, report);
        return this.findOneReport(id);
    }

    async removeReport(id: number): Promise<void> {
        const result = await this.adminReportsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Report with ID ${id} not found`);
        }
    }
} 
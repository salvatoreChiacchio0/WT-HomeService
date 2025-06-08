import { Controller, Post, UseInterceptors, UploadedFile, Body, Param, Get, Res, Delete, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileUploadService } from '../services/file-upload.service';
import { ProviderImage } from '../entities/service-provider/ProviderImage.entity';
import { ProviderCertificate } from '../entities/service-provider/ProviderCertificate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceProviderService } from './service-providers.service';

@Controller('provider-files')
export class FileUploadController {
    constructor(
        private readonly fileUploadService: FileUploadService,
        private readonly serviceProviderService: ServiceProviderService,
        @InjectRepository(ProviderImage)
        private imageRepository: Repository<ProviderImage>,
        @InjectRepository(ProviderCertificate)
        private certificateRepository: Repository<ProviderCertificate>,
    ) {}

    @Post('image/:providerId')
    async uploadImage(
        @Param('providerId') providerId: number,
        @Body('base64Image') base64Image: string,
        @Body('imageType') imageType: string,
    ): Promise<ProviderImage> {
        const filePath = await this.fileUploadService.saveBase64Image(base64Image, providerId, imageType);
        
        const image = this.imageRepository.create({
            base64_image: base64Image,
            image_type: imageType,
            provider_id: providerId,
        });

        return this.imageRepository.save(image);
    }

    @Post('certificate/:userId')
    @UseInterceptors(FileInterceptor('file'))
    async uploadCertificate(
        @Param('userId') userId: number,
        @UploadedFile() file: Express.Multer.File,
        @Body('certificate_name') certificateName: string,
        @Body('certificate_type') certificateType?: string,
        @Body('issue_date') issueDate?: string,
        @Body('expiry_date') expiryDate?: string,
    ): Promise<ProviderCertificate> {
        if (!file) {
            throw new BadRequestException('Certificate file is required');
        }
        if (!certificateName) {
            throw new BadRequestException('Certificate name is required');
        }

        // Get the provider_id from the user_id
        const provider = await this.serviceProviderService.findByUserId(userId);
        if (!provider) {
            throw new BadRequestException('Provider not found');
        }

        const { fileName, filePath } = await this.fileUploadService.savePdfCertificate(file, provider.provider_id);
        
        const certificateData: Partial<ProviderCertificate> = {
            file_name: fileName,
            file_path: filePath,
            certificate_name: certificateName,
            certificate_type: certificateType || undefined,
            issue_date: issueDate ? new Date(issueDate) : undefined,
            expiry_date: expiryDate ? new Date(expiryDate) : undefined,
            provider_id: provider.provider_id,
            is_verified: false,
        };

        const certificate = this.certificateRepository.create(certificateData);
        return this.certificateRepository.save(certificate);
    }

    @Get('certificate/:certificateId')
    async getCertificate(
        @Param('certificateId') certificateId: number,
        @Res() res: Response,
    ): Promise<void> {
        const certificate = await this.certificateRepository.findOne({ where: { certificate_id: certificateId } });
        if (!certificate) {
            res.status(404).send('Certificate not found');
            return;
        }

        const fileStream = await this.fileUploadService.getFileStream(certificate.file_path);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${certificate.file_name}"`);
        fileStream.pipe(res);
    }

    @Delete('image/:imageId')
    async deleteImage(@Param('imageId') imageId: number): Promise<void> {
        const image = await this.imageRepository.findOne({ where: { image_id: imageId } });
        if (image) {
            await this.imageRepository.remove(image);
        }
    }

    @Delete('certificate/:certificateId')
    async deleteCertificate(@Param('certificateId') certificateId: number): Promise<void> {
        const certificate = await this.certificateRepository.findOne({ where: { certificate_id: certificateId } });
        if (certificate) {
            await this.fileUploadService.deleteFile(certificate.file_path);
            await this.certificateRepository.remove(certificate);
        }
    }

    @Get('certificates/provider/:providerId')
    async getCertificatesByProviderId(
        @Param('providerId') providerId: number,
    ): Promise<ProviderCertificate[]> {
        const certificates = await this.certificateRepository.find({
            where: { provider_id: providerId },
            order: { certificate_id: 'DESC' }
        });
        return certificates;
    }
} 
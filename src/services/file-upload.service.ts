import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
    private readonly logger = new Logger(FileUploadService.name);
    private readonly uploadDir: string;

    constructor(private configService: ConfigService) {
        this.uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async saveBase64Image(base64Data: string, providerId: number, imageType: string): Promise<string> {
        try {
            // Remove the data URL prefix if present
            const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Image, 'base64');
            
            // Create provider directory if it doesn't exist
            const providerDir = path.join(this.uploadDir, 'images', providerId.toString());
            if (!fs.existsSync(providerDir)) {
                fs.mkdirSync(providerDir, { recursive: true });
            }

            // Generate unique filename
            const fileName = `${uuidv4()}.jpg`;
            const filePath = path.join(providerDir, fileName);

            // Save the file
            await fs.promises.writeFile(filePath, buffer);

            return filePath;
        } catch (error) {
            this.logger.error(`Error saving base64 image: ${error.message}`);
            throw error;
        }
    }

    async savePdfCertificate(file: Express.Multer.File, providerId: number): Promise<{ fileName: string; filePath: string }> {
        try {
            // Create provider directory if it doesn't exist
            const providerDir = path.join(this.uploadDir, 'certificates', providerId.toString());
            if (!fs.existsSync(providerDir)) {
                fs.mkdirSync(providerDir, { recursive: true });
            }

            // Generate unique filename
            const fileName = `${uuidv4()}.pdf`;
            const filePath = path.join(providerDir, fileName);

            // Save the file
            await fs.promises.writeFile(filePath, file.buffer);

            return {
                fileName,
                filePath
            };
        } catch (error) {
            this.logger.error(`Error saving PDF certificate: ${error.message}`);
            throw error;
        }
    }

    async deleteFile(filePath: string): Promise<void> {
        try {
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
            }
        } catch (error) {
            this.logger.error(`Error deleting file: ${error.message}`);
            throw error;
        }
    }

    async getFileStream(filePath: string): Promise<fs.ReadStream> {
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error('File not found');
            }
            return fs.createReadStream(filePath);
        } catch (error) {
            this.logger.error(`Error getting file stream: ${error.message}`);
            throw error;
        }
    }
} 
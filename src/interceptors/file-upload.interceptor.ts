import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  private storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = 'uploads/services';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  private upload = multer({
    storage: this.storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
  }).array('images', 5); // Allow up to 5 images

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    return new Promise((resolve, reject) => {
      this.upload(request, response, async (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Add file paths to request body
        if (request.files) {
          const files = request.files as Express.Multer.File[];
          request.body.images = files.map(file => file.path.replace(/\\/g, '/'));
        }

        try {
          const result = await next.handle().toPromise();
          resolve(result);
        } catch (error) {
          console.log("ERROR")
          reject(error);
        }
      });
    });
  }
} 
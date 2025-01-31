import { Controller, Post, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransactionUploadService } from './transaction-upload.service';
import { Request } from 'express';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadResponse } from './dtos/upload-response.dto';

@ApiTags('Transaction Upload')
@Controller('api/upload')
export class TransactionUploadController {
  constructor(private readonly transactionUploadService: TransactionUploadService) {}

  @Post()
  @ApiOperation({ summary: 'Upload transaction file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'File successfully processed',
    type: FileUploadResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid file format' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.transactionUploadService.processFile(file, req.session.id);
  }
}
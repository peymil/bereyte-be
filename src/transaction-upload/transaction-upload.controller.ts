import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransactionUploadService } from './transaction-upload.service';
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
  constructor(
    private readonly transactionUploadService: TransactionUploadService,
  ) {}

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
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.transactionUploadService.processFile(file);
  }

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete all transactions' })
  @ApiResponse({
    status: 204,
    description: 'All transactions deleted successfully',
  })
  async deleteAllTransactions() {
    return this.transactionUploadService.deleteAllTransactions();
  }
}

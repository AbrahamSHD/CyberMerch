import { Controller } from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
}

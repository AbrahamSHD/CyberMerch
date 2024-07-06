import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  getStaticImage(imageName: string) {
    return imageName;
  }
}

import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileReaderService {
  readFileAsString(filePath: string): string {
    return fs.readFileSync(filePath, {encoding: 'utf8'});
  }
}

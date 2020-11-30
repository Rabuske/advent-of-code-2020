import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

@Injectable()
export class Day01Service {
  constructor(private readonly fileReaderService: FileReaderService) {}
  
  processInput(): string {
    return this.fileReaderService.readFileAsString("./input/day01.txt");
  }
}

import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/17

@Injectable()
export class Day17Service implements Processor{
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService
      .readFileAsString('./input/day17.txt')
      .split('\n');

    return `Part 01 [${null}] Part 02 [${null}]`;
  }

}

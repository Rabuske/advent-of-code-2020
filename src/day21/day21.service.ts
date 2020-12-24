import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/21

@Injectable()
export class Day21Service implements Processor{
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService
      .readFileAsString('./input/day21.txt')
      .split('\n');


    return `Part 01 [${null}] Part 02 [${null}]`;
  }  

}

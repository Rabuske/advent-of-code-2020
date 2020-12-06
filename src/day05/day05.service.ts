import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/5

@Injectable()
export class Day05Service {
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService.readFileAsString('./input/day05.txt');

    const highestSeatId = fileContent.split("\n").map(line => this.getSeatId(line)).reduce((prev, next) => prev > next ? prev : next);

    return `Part 01[${highestSeatId}]`;
  }

  getRowNumber(input: string) : number{
    const binary = input.replace(/B/g, "1").replace(/F/g, "0").replace(/R/g, "").replace(/L/g, "");
    return Number.parseInt(binary, 2);
  }

  getColumnNumber(input: string) : number{
    const binary = input.replace(/R/g, "1").replace(/L/g, "0").replace(/B/g, "").replace(/F/g, "");
    return Number.parseInt(binary, 2);
  }

  getSeatId(input: string) : number {
    return (this.getRowNumber(input) * 8)  + this.getColumnNumber(input);
  }
}

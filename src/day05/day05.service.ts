import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/5

@Injectable()
export class Day05Service {
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService.readFileAsString('./input/day05.txt').split("\n");

    const highestSeatId = fileContent.map(line => this.getSeatId(line)).reduce((prev, next) => prev > next ? prev : next);

    return `Part 01[${highestSeatId}] Part 02[${this.getMySeat(fileContent)}]`;
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

  getMySeat(input: string[]) : number {
    const seats = input.map(line => this.getSeatId(line)).sort((a, b) => a - b);
    // Find a seat whose next one is not this one + 1. 
    return seats.reduce((previousSeat, currentSeat) => {     
      return (previousSeat + 1) === currentSeat? currentSeat : previousSeat;
    }) + 1;
  }
}

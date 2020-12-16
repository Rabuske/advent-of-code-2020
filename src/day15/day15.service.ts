import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/15

@Injectable()
export class Day15Service {
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService
      .readFileAsString('./input/day15.txt')
      .split('\n');

    return `Part 01 [${this.getNthNumber(fileContent[0], 2020)}] Part 02 [${this.getNthNumber(fileContent[0], 30000000)}]`;
  }

  getNthNumber(input: string, totalRounds: number) {
    const spokenNumbers = new Map<number, number>();
    const numbers = input.split(",").map(n => Number.parseInt(n)); 
    numbers.forEach((number, index) => spokenNumbers.set(number, index + 1));

    // The game starts at turn = length + 2
    let lastSpokenNumber = 0;
    for (let turn = spokenNumbers.size + 2; turn <= totalRounds; turn ++) {
      const nextNumber = spokenNumbers.has(lastSpokenNumber)? (turn - 1) - spokenNumbers.get(lastSpokenNumber) : 0;
      spokenNumbers.set(lastSpokenNumber, turn - 1);
      lastSpokenNumber = nextNumber;     
    }
    return lastSpokenNumber;
  }

}

/* PS: The same code I wrote on part 01 worked for part 02, it takes a while to run, but apparently is acceptable.
The catch is that a lot of people would keep track of the spoken numbers and would end-up using gigs of memory
*/

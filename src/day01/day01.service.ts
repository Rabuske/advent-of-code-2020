import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/1

interface PartialSum {
  result: number;
  number1: number;
  number2: number;
}

@Injectable()
export class Day01Service {
  constructor(private readonly fileReaderService: FileReaderService) {}
  
  processInput(): string {
    const fileContent =  this.fileReaderService.readFileAsString("./input/day01.txt");
    const numbers = fileContent.split('\n').map(line => Number.parseInt(line));
    const numbersAsASet = new Set(numbers);

    return "Part One " + this.partOne(numbers, numbersAsASet) + " Part Two " + this.partTwo(numbers, numbersAsASet);    
  }

  partOne(numbers: Array<number>, numbersAsSet: Set<number>) : string {
    const firstNumber = numbers.find(entry => numbersAsSet.has(2020 - entry));
    return (firstNumber * (2020 - firstNumber)).toString();    
  }

  partTwo(numbers: Array<number>, numbersAsSet: Set<number>) : string {
    // Naive approach: create a new array with all the sums of two numbers that are lower than 2020
    const partialSums = new Array<PartialSum>();
    for(let i = 0; i < numbers.length - 1; i++) {
      for(let j = i + 1; j < numbers.length; j++){
        const partialSum = numbers[i] + numbers[j];
        if(partialSum < 2020) {
          partialSums.push({result: partialSum, number1 : numbers[i], number2 : numbers[j]});
        }
      }
    }

    // Same processing as part one
    const validEntry = partialSums.find(entry => numbersAsSet.has(2020 - entry.result));
    return (validEntry.number1 * validEntry.number2 * (2020 - validEntry.result)).toString();    
  }

}

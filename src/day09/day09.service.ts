import { Injectable } from '@nestjs/common';
import { start } from 'repl';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/9

@Injectable()
export class Day09Service {
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService.readFileAsString('./input/day09.txt').split("\n");
    const numbers = fileContent.map(line => Number.parseInt(line));3
    const buggedNumber = this.findErroneousNumber(numbers);
    return `Part 01 [${buggedNumber}] Part 02 [${this.getSumOfSmallestAndLargest(this.findSequentialNumbersThatSumsTo(buggedNumber, numbers))}]`;
  }

  findErroneousNumber(numbers: number[]) : number {
    for(let i = 25; i < numbers.length; i++) {
      
      let hasTwoNumbersThatAddToTheNumber = false;
      const previous25 = new Set(numbers.slice(i-25, i));
      
      previous25.forEach(n1 => {
        if(previous25.has(numbers[i] - n1)){
          hasTwoNumbersThatAddToTheNumber = true;
          return;
        }
      });

      if(!hasTwoNumbersThatAddToTheNumber){
        return numbers[i];
      }
    }
  }

  findSequentialNumbersThatSumsTo(n1: number, numbers: number[]): number[] {
    for(let startIndex = 0; startIndex < numbers.length; startIndex++){
      for(let endIndex = startIndex; endIndex < numbers.length; endIndex++){
        const slice = numbers.slice(startIndex, endIndex + 1);
        const sum = slice.reduce((a, b) => a + b);
        if(sum === n1) return slice;
      }  
    }
    return [];
  }

  getSumOfSmallestAndLargest(numbers: number[]) : number {
    const [smallest, largest] = numbers.reduce((a, b) => {
      return [b < a[0]? b : a[0], b > a[1]? b : a[1]];
    }, [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]);
    return smallest + largest;
  }

}

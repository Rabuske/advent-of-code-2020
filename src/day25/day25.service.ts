import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/25


@Injectable()
export class Day25Service implements Processor{
  constructor(private readonly fileReaderService: FileReaderService) {}
  
  processInput(): string {
    const fileContent =  this.fileReaderService.readFileAsString("./input/day25.txt").split('\n')
    const [cardPublicKey, doorPublicKey] = [Number.parseInt(fileContent[0]), Number.parseInt(fileContent[1])]

    const cardLoopSize = this.getLoopSize(cardPublicKey, 7);
    const doorLoopSize = this.getLoopSize(doorPublicKey, 7);

    return `Part One [${this.generateKey(cardLoopSize, doorPublicKey)}] Part Two [${this.generateKey(doorLoopSize, cardPublicKey)}]`;    
  }

  private generateKey(loopSize: number, subjectNumber: number) {
    let value = 1
    for (let i = 0; i < loopSize; i++) {
      value = (value * subjectNumber) % 20201227
    }
    return value
  }

  private getLoopSize(publicKey: number, initialSubjectNumber: number) {
    let value = 1
    let loopSize = 0
    while(value != publicKey) {
      loopSize += 1
      value = (value * initialSubjectNumber) % 20201227
    }
    return loopSize;
  }

}

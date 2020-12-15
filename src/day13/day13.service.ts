import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/13

interface BusInfo{
  period: number,
  delay: number,
}

@Injectable()
export class Day13Service {
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService
      .readFileAsString('./input/day13.txt')
      .split('\n');
    return `Part 01 [${this.part01(fileContent)}] Part 02 [${this.part02(fileContent)}]`;
  }

  part01(fileContent: string[]) : number {
    const myTimestamp = Number.parseInt(fileContent[0]);
    const busIds = fileContent[1].split(',').map(value => Number.parseInt(value)).filter(value => value > 0);
    const nextBus = busIds.map(id => [
      id,
      (id - (myTimestamp % id))
    ]).reduce((a, b) => a[1] < b[1] ? a : b);
    return nextBus[0] * nextBus[1];
  }


  // I had to look this one up. I found out it can be solved with Chinese Remainder Theorem. At least I learned something new today 😊
  // Developed the solution as explained here: https://www.youtube.com/watch?v=zIFehsBHB8o
  part02(fileContent: string[]): BigInt {
    // Transforms the input into an list of bus periods (mod) and delay (remainder)
    const buses = fileContent[1].split(',')
      .map((value, index) => <BusInfo>{period: Number.parseInt(value), delay: Number.parseInt(value) - (index % Number.parseInt(value))})
      .filter(busInfo => !Number.isNaN(busInfo.period));
    
    const N1 = buses.map(bus => bus.period).reduce((a, b) => a * b);
    const N1x = buses
      .map(bus => BigInt(bus.delay) * BigInt((N1/bus.period)) * BigInt(this.findX1(N1/bus.period, bus.period))) 
      .reduce((a,b) => a + b);

    return N1x % BigInt(N1);
  }

  findX1(N: number, mod: number) : number {
    const simplifiedN = N % mod;
    for (let i = 1; i < mod; i++) {
      if ((simplifiedN * i) % mod === 1) {
        return i;
      }
    }
    return 1;
  }
}

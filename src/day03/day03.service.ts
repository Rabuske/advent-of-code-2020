import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';
import Point from 'src/utils/point';

// https://adventofcode.com/2020/day/3


@Injectable()
export class Day03Service {
  constructor(private readonly fileReaderService: FileReaderService) {}
  
  processInput(): string {
    const fileContent =  this.fileReaderService.readFileAsString("./input/day03.txt");
    
    return this.part01(fileContent.split("\n")).toString();
  }

  part01(terrain: string[]): number {
    const position = new Point(0,0);
    return terrain.slice(1).filter(line => {
      position.x += 3;
      return line.charAt(position.x % line.length) === '#';
    }).length;
  }
}

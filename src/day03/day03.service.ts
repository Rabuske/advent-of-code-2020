import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';
import Point from 'src/utils/point';

// https://adventofcode.com/2020/day/3


@Injectable()
export class Day03Service {
  constructor(private readonly fileReaderService: FileReaderService) {}
  
  processInput(): string {
    const fileContent =  this.fileReaderService.readFileAsString("./input/day03.txt");
    const terrain = fileContent.split("\n");
    return `Part 01 [${this.part01(terrain)}], Part 02 [${this.part02(terrain)}]`;
  }

  part01(terrain: string[]): number {
    return this.calculateNumberOfTrees(terrain, new Point(3, 1));
  }

  part02(terrain: string[]): number {
    return this.calculateNumberOfTrees(terrain, new Point(1 , 1)) *
           this.calculateNumberOfTrees(terrain, new Point(3 , 1)) *
           this.calculateNumberOfTrees(terrain, new Point(5 , 1)) *
           this.calculateNumberOfTrees(terrain, new Point(7 , 1)) *
           this.calculateNumberOfTrees(terrain, new Point(1 , 2));
  }

  calculateNumberOfTrees(terrain: string[], slope: Point) : number{
    const position = new Point(0, 0);
    let numberOfTrees = 0;
    for(position.y = slope.y; position.y < terrain.length; position.y += slope.y) {
      position.x += slope.x;
      if(terrain[position.y][position.x % terrain[position.y].length] === '#'){
        numberOfTrees++;
      }
    }
    return numberOfTrees;
  }


}

import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/17

interface Point3D{
  x: number,
  y: number,
  z: number
}
class Game {
  private activeCubes: Set<string>;

  constructor(initialState: string[][]){
    this.activeCubes = new Set();
    initialState.forEach((line, x) => line.forEach((column, y) => {
      if(column === "#") this.activeCubes.add(JSON.stringify(<Point3D>{x: x, y: y, z:0}));
    }));
  }
  
  private getNeighborsCoordinates(point: Point3D) : Point3D[] {
    const neighbors = []; 
    for (let x = point.x - 1; x <= point.x + 1; x++) {
      for (let y = point.y - 1; y <= point.y + 1; y++) {
        for (let z = point.z - 1; z <= point.z + 1; z++) {
          if(point.x === x && point.y === y && point.z === z) continue;
          	neighbors.push({x: x, y: y, z:z});
        }
      }
    }
    return neighbors;
  }

  private getNumberOfActiveNeighbors(point: Point3D): number {
    const neighbors = this.getNeighborsCoordinates(point);
    return neighbors.filter(neighbor => this.activeCubes.has(JSON.stringify(neighbor))).length;
  }

  private getAllPointsThatNeedToBeReevaluated() : Point3D[] {
    const pointsToReevaluate = new Set<string>();
    this.activeCubes.forEach(point => {
      pointsToReevaluate.add(point);
      this.getNeighborsCoordinates(JSON.parse(point)).forEach(neighbor => pointsToReevaluate.add(JSON.stringify(neighbor)));
    });
    const result = [];
    pointsToReevaluate.forEach(entry => result.push(JSON.parse(entry)));
    return result;
  }

  playRound() {
    // Get all the points that need to be reevaluated (they are active, or are neighbors of active cubes)
    const pointsToReevaluate = this.getAllPointsThatNeedToBeReevaluated();
    
    // Evaluate the new active points
    const newActiveCubes = new Set<string>();
    pointsToReevaluate.forEach(point => {
      const numberOfActiveNeighbors = this.getNumberOfActiveNeighbors(point);
      const isActive = this.activeCubes.has(JSON.stringify(point)); 
      if(isActive && (numberOfActiveNeighbors === 2 || numberOfActiveNeighbors === 3)) {
        newActiveCubes.add(JSON.stringify(point));
      } else if(!isActive && numberOfActiveNeighbors === 3) {
        newActiveCubes.add(JSON.stringify(point));
      }
    })

    this.activeCubes = newActiveCubes;
  }

  countNumberOfActiveCubes() : number {
    return this.activeCubes.size;
  }
}

@Injectable()
export class Day17Service implements Processor{
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService
      .readFileAsString('./input/day17.txt')
      .split('\n');

    const game = new Game(fileContent.map(line => line.split('')));
    
    return `Part 01 [${this.play6CyclesAndGetActives(game)}] Part 02 [${null}]`;
  }

  play6CyclesAndGetActives(game: Game) : number {
    for (let index = 0; index < 6; index++) {
      game.playRound();
    }
    return game.countNumberOfActiveCubes();
  }

}

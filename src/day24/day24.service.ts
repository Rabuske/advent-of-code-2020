import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';
import Point3d from 'src/utils/point3d';

// https://adventofcode.com/2020/day/24

enum Direction {
  e = 'e',
  se = 'se',
  sw = 'sw',
  w = 'w',
  nw = 'nw',
  ne = 'ne'
}

interface Tile {
  position: Point3d,
  isFlipped: boolean
}

const directionToPoint = (direction: Direction) : Point3d => {
  switch (direction) {
    case Direction.e:
      return new Point3d(1,-1,0);
    case Direction.w:
      return new Point3d(-1,1,0);
    case Direction.ne:
      return new Point3d(0,-1,1);
    case Direction.se:
      return new Point3d(1,0,-1);
    case Direction.nw:
      return new Point3d(-1,0,1);
    case Direction.sw:
      return new Point3d(0,1,-1);
  }
} 

@Injectable()
export class Day24Service implements Processor{
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService
      .readFileAsString('./input/day24.txt')
      .split('\n');
    
    const instructions = this.getInstructions(fileContent);
    const tiles = this.executeInstructions(instructions);
    const flippedTiles = [... tiles].filter(tile => tile[1].isFlipped);
    const flippedTilesAfter100Interactions = this.advanceArt(new Map(flippedTiles), 100);

    return `Part 01 [${flippedTiles.length}] Part 02 [${flippedTilesAfter100Interactions.size}]`;
  }

  getInstructions(input:string[]) : Direction[][] {
    const instructions = new Array<Array<Direction>>();
    input.forEach(line => {
      let currentDirectionString = "";
      const instruction = new Array<Direction>();
      const characters = line.split("");
      while(characters.length > 0) {
        currentDirectionString += characters.shift();
        const direction = Direction[currentDirectionString];
        if(direction) {
          instruction.push(direction);
          currentDirectionString = "";
        }
      }
      instructions.push(instruction);
    });
    return instructions;
  }

  executeInstructions(instructions: Direction[][]) : Map<string, Tile> {
    const tiles = new Map<string, Tile>();

    instructions.forEach(directions => {
      let currentPosition = new Point3d(0, 0, 0);
      directions.forEach(direction => {
        const directionMovement = directionToPoint(direction);
        currentPosition = currentPosition.add(directionMovement);
      });
      if(!tiles.has(currentPosition.toString())) {
        tiles.set(currentPosition.toString(), { 
          position: currentPosition,
          isFlipped: true,
        });
      }
      else {
        const tileToFlip = tiles.get(currentPosition.toString());  
        tileToFlip.isFlipped = !tileToFlip.isFlipped;
      }
    });
    return tiles;
  }

  advanceArt(tiles: Map<string, Tile>, numberOfInteractions: number){
    
    let resultingTiles = tiles;
    for (let i = 0; i < numberOfInteractions; i++) {
      let currentInteractionTiles = this.generateAllRelevantTiles(resultingTiles);
      currentInteractionTiles = this.processTiles(currentInteractionTiles);
      resultingTiles = new Map([...currentInteractionTiles].filter(tile => tile[1].isFlipped));
    }

    return resultingTiles;
  }

  generateAllRelevantTiles(tiles: Map<string, Tile>) : Map<string, Tile> {
    const resultingTiles = new Map<string, Tile>();
    tiles.forEach(tile => {
      const positions = this.getNeighborsPositions(tile);
      positions.push(tile.position);
      positions.forEach(position => {
        const tile = tiles.has(position.toString())? tiles.get(position.toString()) : <Tile>{position: position, isFlipped: false};
        resultingTiles.set(position.toString(), {...tile})
      });
    });
    return resultingTiles;
  }

  getNeighborsPositions(tile: Tile): Point3d[] {
    const positions = new Array<Point3d>();
    positions.push(tile.position.add(new Point3d(1,-1,0)));
    positions.push(tile.position.add(new Point3d(-1,1,0)));
    positions.push(tile.position.add(new Point3d(0,-1,1)));
    positions.push(tile.position.add(new Point3d(1,0,-1)));
    positions.push(tile.position.add(new Point3d(-1,0,1)));
    positions.push(tile.position.add(new Point3d(0,1,-1)));
    return positions;
  }

  processTiles(tiles: Map<string, Tile>): Map<string,Tile> {
    const resultingTiles = new Map<string, Tile>();
    tiles.forEach(tile => {
      const neighborsPositions = this.getNeighborsPositions(tile);
      const numberOfFlipped = neighborsPositions.map(position => 
        tiles.has(position.toString())? tiles.get(position.toString()) : <Tile>{position : position, isFlipped: false}
      ).filter(tile => tile.isFlipped).length;
      if(tile.isFlipped && (numberOfFlipped === 0 || numberOfFlipped > 2)){
        resultingTiles.set(tile.position.toString(), {...tile, isFlipped: false});
        return;
      } 
      if(!tile.isFlipped && numberOfFlipped === 2) {
        resultingTiles.set(tile.position.toString(), {...tile, isFlipped: true});
        return;
      }
      resultingTiles.set(tile.position.toString(), {...tile});      
    })

    return resultingTiles;
  }

}

import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';
import Point from 'src/utils/point';

// https://adventofcode.com/2020/day/12

interface Action {
  id: string;
  value: number;
}

class Ship {
  private _currentWayPoint: Point;
  private _currentPosition: Point; // X is the east/west, Y is the north/south
 
  constructor(wayPoint: Point) {
    this._currentPosition = new Point(0, 0);
    this._currentWayPoint = wayPoint;
  }

  private _deriveNavigationPoint(direction: string, value: number): Point {
    switch (direction) {
      case 'S':
        return new Point(0, -value);
      case 'N':
        return new Point(0, value);
      case 'E':
        return new Point(value, 0);
      case 'W':
        return new Point(-value, 0);
    }
  }

  private _rotateWayPoint(angle: number) {
    const radians = angle * (Math.PI / 180);
    const sin = Math.sin(radians);
    const cos = Math.cos(radians);

    this._currentWayPoint = new Point(
      Math.round(this._currentWayPoint.x * cos - this._currentWayPoint.y * sin),
      Math.round(this._currentWayPoint.x * sin + this._currentWayPoint.y * cos)
    );
  }  

  public processActionsPart01(actions: Action[]) {
    actions.forEach(action => {
      if(['N', 'S', 'E', 'W'].includes(action.id)) {
        this._currentPosition = this._currentPosition.add(this._deriveNavigationPoint(action.id, action.value));
      } else if(action.id === 'L') {
        this._rotateWayPoint(action.value);        
      } else if(action.id === 'R') {
        this._rotateWayPoint(-action.value);
      } else if(action.id === 'F') {
        this._currentPosition = this._currentPosition.add(this._currentWayPoint.multiplyByScalar(action.value));
      }
    });
  }

  public processActionsPart02(actions: Action[]) {
    actions.forEach(action => {
      if(['N', 'S', 'E', 'W'].includes(action.id)) {
        this._currentWayPoint = this._currentWayPoint.add(this._deriveNavigationPoint(action.id, action.value));
      } else if(action.id === 'L') {
        this._rotateWayPoint(action.value);        
      } else if(action.id === 'R') {
        this._rotateWayPoint(-action.value);
      } else if(action.id === 'F') {
        this._currentPosition = this._currentPosition.add(this._currentWayPoint.multiplyByScalar(action.value));
      }
    });
  }

  get currentPosition(): Point {
    return this._currentPosition;
  }
}

@Injectable()
export class Day12Service {
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService
      .readFileAsString('./input/day12.txt')
      .split('\n');
    const actions = fileContent.map(line => <Action>{ id: line[0], value: Number.parseInt(line.slice(1)) } );
    return `Part 01 [${this.processActionsAndGetDistancePart01(actions)}] Part 02 [${this.processActionsAndGetDistancePart02(actions)}]`;
  }

  processActionsAndGetDistancePart01(actions: Action[]) : number {
    const ship = new Ship(new Point(1,0));
    ship.processActionsPart01(actions);
    return ship.currentPosition.calculateManhattanDistance(new Point(0,0));
  }

  processActionsAndGetDistancePart02(actions: Action[]) : number {
    const ship = new Ship(new Point(10, 1));
    ship.processActionsPart02(actions);
    return ship.currentPosition.calculateManhattanDistance(new Point(0,0));
  }

}

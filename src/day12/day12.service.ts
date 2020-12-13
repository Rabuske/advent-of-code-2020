import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';
import Point from 'src/utils/point';

// https://adventofcode.com/2020/day/12

enum Direction {
  NORTH,
  SOUTH,
  EAST,
  WEST,
}

interface Action {
  id: string;
  value: number;
}

class Ship {
  private _currentDirection: Direction;
  private _currentWayPoint: Point;
  private _currentPosition: Point; // X is the east/west, Y is the north/south
  private static _directionOrder = [Direction.EAST, Direction.SOUTH, Direction.WEST, Direction.NORTH];

  constructor() {
    this._currentDirection = Direction.EAST;
    this._currentPosition = new Point(0, 0);
    this._currentWayPoint = new Point(10, 1);
  }

  private _deriveNavigationPoint(direction: Direction, value: number): Point {
    switch (direction) {
      case Direction.SOUTH:
        return new Point(0, -value);
      case Direction.NORTH:
        return new Point(0, value);
      case Direction.EAST:
        return new Point(value, 0);
      case Direction.WEST:
        return new Point(-value, 0);
    }
  }

  private _updateDirection(numberOfTurnsAndDirection: number) {
    const currentDirectionIndex = Ship._directionOrder.findIndex(direction => direction === this._currentDirection);
    let adjustedDirectionIndex = (currentDirectionIndex + numberOfTurnsAndDirection) % Ship._directionOrder.length;
    adjustedDirectionIndex = adjustedDirectionIndex >= 0 ? adjustedDirectionIndex : Ship._directionOrder.length + adjustedDirectionIndex;
    this._currentDirection = Ship._directionOrder[adjustedDirectionIndex];
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
      switch (action.id) {
        case 'N':
          this._currentPosition = this._currentPosition.add(this._deriveNavigationPoint(Direction.NORTH, action.value));
          break;
        case 'S':
          this._currentPosition = this._currentPosition.add(this._deriveNavigationPoint(Direction.SOUTH, action.value));
          break;
        case 'E':
          this._currentPosition = this._currentPosition.add(this._deriveNavigationPoint(Direction.EAST, action.value));
          break;
        case 'W':
          this._currentPosition = this._currentPosition.add(this._deriveNavigationPoint(Direction.WEST, action.value));
          break;
        case 'L':
          this._updateDirection(-(action.value / 90));
          break;
        case 'R':
          this._updateDirection(action.value / 90);
          break;
        case 'F':
          this._currentPosition = this._currentPosition.add(this._deriveNavigationPoint(this._currentDirection, action.value));
          break;
      }
    });
  }

  public processActionsPart02(actions: Action[]) {
    actions.forEach(action => {
      switch (action.id) {
        case 'N':
          this._currentWayPoint = this._currentWayPoint.add(this._deriveNavigationPoint(Direction.NORTH, action.value));
          break;
        case 'S':
          this._currentWayPoint = this._currentWayPoint.add(this._deriveNavigationPoint(Direction.SOUTH, action.value));
          break;
        case 'E':
          this._currentWayPoint = this._currentWayPoint.add(this._deriveNavigationPoint(Direction.EAST, action.value));
          break;
        case 'W':
          this._currentWayPoint = this._currentWayPoint.add(this._deriveNavigationPoint(Direction.WEST, action.value));
          break;
        case 'L':
          this._rotateWayPoint(action.value);
          break;
        case 'R':
          this._rotateWayPoint(-action.value);
          break;
        case 'F':
          this._currentPosition = this._currentPosition.add(this._currentWayPoint.multiplyByScalar(action.value));
          break;
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
    const ship = new Ship();
    ship.processActionsPart01(actions);
    return ship.currentPosition.calculateManhattanDistance(new Point(0,0));
  }

  processActionsAndGetDistancePart02(actions: Action[]) : number {
    const ship = new Ship();
    ship.processActionsPart02(actions);
    return ship.currentPosition.calculateManhattanDistance(new Point(0,0));
  }

}

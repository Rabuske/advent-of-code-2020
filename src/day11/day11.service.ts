import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/11


class SeatLayout {
  constructor(public seats: string[]) {}

  generateNextLayout(arePeoplePicky: boolean) : SeatLayout {
    return new SeatLayout(
      this.seats.map((seatRow, seatRowIndex) => 
        seatRow.split("").map((_,seatColumnIndex) => 
          arePeoplePicky? 
          this.getNewSeatValueForPickyPeople(seatRowIndex, seatColumnIndex) :
          this.getNewSeatValue(seatRowIndex, seatColumnIndex) 
        ).join("")
      )
    );
  }

  private getNewSeatValueForPickyPeople(seatRow: number, seatColumn: number) : string {
    const seatValue = this.seats[seatRow][seatColumn];
    if(seatValue === '.') return seatValue;
    const numberOfOccupiedAdjacentSeats = this.getNumberOfOccupiedAdjacentSeatsForPickyPeople(seatRow, seatColumn);
    if(seatValue === 'L' && numberOfOccupiedAdjacentSeats === 0) return '#';
    if(seatValue === '#' && numberOfOccupiedAdjacentSeats > 4) return 'L';
    return seatValue;
  }

  private getNewSeatValue(seatRow: number, seatColumn: number) : string {
    const seatValue = this.seats[seatRow][seatColumn];
    if(seatValue === '.') return seatValue;
    const numberOfOccupiedAdjacentSeats = this.getNumberOfOccupiedAdjacentSeats(seatRow, seatColumn);
    if(seatValue === 'L' && numberOfOccupiedAdjacentSeats === 0) return '#';
    if(seatValue === '#' && numberOfOccupiedAdjacentSeats > 3) return 'L';
    return seatValue;
  }

  private getNumberOfOccupiedAdjacentSeats(seatRow: number, seatColumn: number) : number {
    let occupiedSeats = 0;    
    occupiedSeats += this.seats[(seatRow - 1)]?.charAt(seatColumn - 1) === '#' ? 1 : 0;
    occupiedSeats += this.seats[(seatRow - 1)]?.charAt(seatColumn + 0) === '#' ? 1 : 0;
    occupiedSeats += this.seats[(seatRow - 1)]?.charAt(seatColumn + 1) === '#' ? 1 : 0;
    occupiedSeats += this.seats[(seatRow + 0)]?.charAt(seatColumn - 1) === '#' ? 1 : 0;
    occupiedSeats += this.seats[(seatRow + 0)]?.charAt(seatColumn + 1) === '#' ? 1 : 0;
    occupiedSeats += this.seats[(seatRow + 1)]?.charAt(seatColumn - 1) === '#' ? 1 : 0;
    occupiedSeats += this.seats[(seatRow + 1)]?.charAt(seatColumn + 0) === '#' ? 1 : 0;
    occupiedSeats += this.seats[(seatRow + 1)]?.charAt(seatColumn + 1) === '#' ? 1 : 0;
    return occupiedSeats;
  }

  private getNumberOfOccupiedAdjacentSeatsForPickyPeople(seatRow: number, seatColumn: number) : number {
    let occupiedSeats = 0;
    occupiedSeats += this.getNextSeatInLineOfVision(seatRow, seatColumn, -1, -1) === '#' ? 1 : 0;
    occupiedSeats += this.getNextSeatInLineOfVision(seatRow, seatColumn, -1,  0) === '#' ? 1 : 0;
    occupiedSeats += this.getNextSeatInLineOfVision(seatRow, seatColumn, -1, +1) === '#' ? 1 : 0;
    occupiedSeats += this.getNextSeatInLineOfVision(seatRow, seatColumn,  0, -1) === '#' ? 1 : 0;
    occupiedSeats += this.getNextSeatInLineOfVision(seatRow, seatColumn,  0, +1) === '#' ? 1 : 0;
    occupiedSeats += this.getNextSeatInLineOfVision(seatRow, seatColumn, +1, -1) === '#' ? 1 : 0;
    occupiedSeats += this.getNextSeatInLineOfVision(seatRow, seatColumn, +1,  0) === '#' ? 1 : 0;
    occupiedSeats += this.getNextSeatInLineOfVision(seatRow, seatColumn, +1, +1) === '#' ? 1 : 0;
    return occupiedSeats;
  }

  private getNextSeatInLineOfVision(seatRow: number, seatColumn: number, additiveRow: number, additiveColumn: number): string | undefined {
    let checkRow = seatRow + additiveRow;
    let checkColumn = seatColumn + additiveColumn;
    while(true){
      const seat = this.seats[checkRow]?.charAt(checkColumn);
      if(!seat || seat === '#' || seat === 'L'){
        return seat;
      }
      checkRow += additiveRow;
      checkColumn += additiveColumn;
    }
  }

  getNumberOfOccupiedSeats(): number {
    return this.seats.map(seatRow => {
        const occupiedSeats = seatRow.match(/#/g);
        return occupiedSeats? occupiedSeats.length : 0;
      }
    ).reduce((a, b) => a + b);
  }

}

@Injectable()
export class Day11Service {
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService.readFileAsString('./input/day11.txt').split("\n");
    return `Part 01 [${this.getNumberOfOccupiedSeatsWhenNoFurtherChangesAreDetected(fileContent, false)}] Part 02 [${this.getNumberOfOccupiedSeatsWhenNoFurtherChangesAreDetected(fileContent, true)}]`;
  }

  getNumberOfOccupiedSeatsWhenNoFurtherChangesAreDetected(fileContent: string[], arePeoplePicky: boolean): number{
    const layouts = [];
    let currentLayout = new SeatLayout(fileContent);
    while(true) {
      const nextLayout = currentLayout.generateNextLayout(arePeoplePicky);
      if(currentLayout.seats.join("") === nextLayout.seats.join("")){
        return currentLayout.getNumberOfOccupiedSeats();
      }
      layouts.push(currentLayout.seats);
      currentLayout = nextLayout;
    }    
  }
}

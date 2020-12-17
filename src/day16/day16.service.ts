import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/16

interface FieldValidation {
  fieldName: string,
  valueRanges: {
    min: number,
    max: number,
  }[];
}

class PuzzleInput {
  private fieldValidations: FieldValidation[];
  private myTicket: number[];
  private nearbyTickets: number[][];

  constructor(fieldValidations: FieldValidation[], myTicket: number[], nearbyTickets: number[][]){
    this.fieldValidations = fieldValidations;
    this.myTicket = myTicket;
    this.nearbyTickets = nearbyTickets;
  }

  private applyValidation(value: number, validation: FieldValidation): boolean {
    return validation.valueRanges.some(range => range.min <= value && range.max >= value); 
  }

  private isFieldValid(value: number) : boolean {
    return this.fieldValidations.some(validation => this.applyValidation(value, validation));
  }

  public getScanningErrorOfNearbyTickets() : number {
    const invalidFields = this.nearbyTickets.map(ticket => ticket.filter(field => !this.isFieldValid(field)));
    return invalidFields.map(fields => fields.reduce((a, b) => a + b, 0)).reduce((a,b) => a + b, 0);
  }

  private getOnlyValidNearbyTickets() : number[][] {
    return this.nearbyTickets.filter(ticket => ticket.every(field => this.isFieldValid(field)));
  }

  public getFieldOrder() : string[] {
    const validNearbyTickets = this.getOnlyValidNearbyTickets();

    // Build a matrix with all the validations in all positions
    const fieldPerPosition = this.myTicket.map(() => [... this.fieldValidations]); 
    
    // Filter out those fields that cannot be in certain positions
    const onlyValidFieldsPerPosition = fieldPerPosition.map((validations, index) => validations.filter(validation => 
      validNearbyTickets.every(ticket => this.applyValidation(ticket[index], validation))
    ));
    
    // Naive approach to remove the fields that are the only field possible in one position from the other ones
    while(onlyValidFieldsPerPosition.some(fieldPerPosition => fieldPerPosition.length > 1)){
      for (let i = 0; i < onlyValidFieldsPerPosition.length; i++) {
        if(onlyValidFieldsPerPosition[i].length > 1){
          continue;
        }
        
        for (let j = 0; j < onlyValidFieldsPerPosition.length; j++) {
          if(i === j) continue;
          onlyValidFieldsPerPosition[j] = onlyValidFieldsPerPosition[j].filter(field => field.fieldName !== onlyValidFieldsPerPosition[i][0].fieldName);
        }
      }
    }
    
    return onlyValidFieldsPerPosition.map(field => field[0].fieldName);
  }

  public getMultiplicationOfMyDepartureFields() : number {
    const fieldPerPosition = this.getFieldOrder();

    return this.myTicket.filter((_, index) => fieldPerPosition[index].startsWith("departure")).reduce((a,b) => a * b); 
  }

}

@Injectable()
export class Day16Service implements Processor{
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService
      .readFileAsString('./input/day16.txt')
      .split('\n');

    const puzzleInput = this.convertInputToPuzzleInput(fileContent);

    return `Part 01 [${puzzleInput.getScanningErrorOfNearbyTickets()}] Part 02 [${puzzleInput.getMultiplicationOfMyDepartureFields()}]`;
  }

  public convertInputToPuzzleInput(fileContent: string[]) : PuzzleInput {
    const fieldValidations = new Array<FieldValidation>();
    for(let i = 0; fileContent[i].length > 1; i++){
      const fieldName = fileContent[i].split(':')[0];
      const numbers = fileContent[i].match(/[0-9]+/g).map(value => Number.parseInt(value));
      fieldValidations.push({
        fieldName: fieldName,
        valueRanges: [
          {min: numbers[0], max: numbers[1]},
          {min: numbers[2], max: numbers[3]}
        ]
      });
    }

    const myTicketIndex = fileContent.findIndex(line => line.startsWith("your ticket")) + 1;
    const myTicket = fileContent[myTicketIndex].split(",").map(value => Number.parseInt(value));

    const nearbyTicketsIndex = fileContent.findIndex(line => line.startsWith("nearby tickets")) + 1;
    const nearbyTickets = new Array<Array<number>>();
    for (let index = nearbyTicketsIndex; index < fileContent.length; index++) {
      nearbyTickets.push(fileContent[index].split(",").map(value => Number.parseInt(value)));
    }

    return new PuzzleInput(fieldValidations, myTicket, nearbyTickets);
  }
  
}

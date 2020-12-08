import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/8

interface Instruction {
  id: string;
  argument: number;
}

class InstructionEvaluator {
  public evaluateInstruction(instruction: Instruction, currentIndex: number, accumulator: number) : [number, number]{
    switch(instruction.id) {
      case "nop":
        return [currentIndex + 1, accumulator];
      case "acc":
        return [currentIndex + 1, accumulator += instruction.argument];
      case "jmp":
        return [currentIndex += instruction.argument, accumulator];
    }
  }
}

class Program {
  constructor(public readonly instructions: Instruction[], 
              private readonly evaluator: InstructionEvaluator) {};  

  public executeWhileNotInLoop(): number {
    let accumulator = 0;
    let currentInstructionIndex = 0;
    const instructionsAlreadyExecuted = new Set<number>();

    while(true) {
      if(instructionsAlreadyExecuted.has(currentInstructionIndex)) {
        break;
      } 
      instructionsAlreadyExecuted.add(currentInstructionIndex);
      const currentInstruction = this.instructions[currentInstructionIndex];      
      [currentInstructionIndex, accumulator] = this.evaluator.evaluateInstruction(currentInstruction, currentInstructionIndex, accumulator);
    }

    return accumulator;
  }

  public executeWhileNotInLoopOrItEnds(): number {
    let accumulator = 0;
    let currentInstructionIndex = 0;
    const instructionsAlreadyExecuted = new Set<number>();

    while(true) {
      // Loop detected
      if(instructionsAlreadyExecuted.has(currentInstructionIndex)) {
        return Number.MIN_SAFE_INTEGER;
      } 

      // Out of bounds detected
      if(currentInstructionIndex < 0 || currentInstructionIndex > this.instructions.length) {
        return Number.MIN_SAFE_INTEGER;
      } 

      // Only acceptable end for the execution
      if(currentInstructionIndex === this.instructions.length) {
        return accumulator;
      }

      instructionsAlreadyExecuted.add(currentInstructionIndex);
      const currentInstruction = this.instructions[currentInstructionIndex];      
      [currentInstructionIndex, accumulator] = this.evaluator.evaluateInstruction(currentInstruction, currentInstructionIndex, accumulator);
    }    
  }  
}


@Injectable()
export class Day08Service {
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService.readFileAsString('./input/day08.txt').split("\n");
    const instructions = this.generateInstructions(fileContent);
    return `Part 01 [${this.accumulatorWhenLoopIsDetected(instructions)}] Part 02 [${this.accumulatorWhenProgramIsFixed(instructions)}]`;
  }

  accumulatorWhenLoopIsDetected(instructions: Instruction[]) : number {
    const program = new Program(instructions, new InstructionEvaluator());
    return program.executeWhileNotInLoop();
  }

  accumulatorWhenProgramIsFixed(instructions: Instruction[]) : number {
    let result = Number.MIN_SAFE_INTEGER;
    let currentModifiedInstructionIndex = 0;
    

    while(result === Number.MIN_SAFE_INTEGER) {
      const modifiedInstructions = [... instructions];
      // modify the program
      while(true){
        const instruction = modifiedInstructions[currentModifiedInstructionIndex];
        if(instruction.id === "nop") {
          modifiedInstructions[currentModifiedInstructionIndex] = {... instruction, id: "jmp" };
          currentModifiedInstructionIndex++;
          break;                    
        }
        if(instruction.id === "jmp") {
          modifiedInstructions[currentModifiedInstructionIndex] = {... instruction, id: "nop" };
          currentModifiedInstructionIndex++;
          break;                    
        }        
        currentModifiedInstructionIndex++;
      }
       result = new Program(modifiedInstructions, new InstructionEvaluator()).executeWhileNotInLoopOrItEnds();
    }
    return result;
  }  

  generateInstructions(input: string[]) : Instruction[] {
    return input.map(line => {
      const parameters = line.split(" ");
      return {id: parameters[0], argument: Number.parseInt(parameters[1])};
    });
  }



}

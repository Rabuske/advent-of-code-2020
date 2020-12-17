import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/14

interface ProgramBlock {
  mask: string,
  instructions: {
    index: number,
    value: number
  }[];
}

class ProgramExecution {
  private memory: Map<number, number>;
  constructor() {
    this.memory = new Map();
  }

  private transformTo36bitString(number: number) : string {
    const valueAsStringBinary = number.toString(2);
    return "0".repeat(36 - valueAsStringBinary.length) + valueAsStringBinary; // ensures "36" bits
  }

  private applyMask(mask: string, value: number) : number {
    // Javascript applies bitwise operations in 32 bits only, so I went with the easier route of using strings instead
    const valueAsAnArrayOfBinaries = this.transformTo36bitString(value).split("");
    mask.split("").forEach((bit, index) => {
      if(bit !== "X"){
        valueAsAnArrayOfBinaries[index] = bit;
      }
    });
    return Number.parseInt(valueAsAnArrayOfBinaries.join(""), 2);
  }
  
  private processFloatingBits(values: string[]) : string[] {
    if(!values[0].includes("X")) {
      return values;
    }

    const currentValue = values[0];
    const processedValues =  [...values, currentValue.replace("X", "0"), currentValue.replace("X", "1")];
    return this.processFloatingBits(processedValues.slice(1));
  }

  private generateAddresses(mask: string, index: number) : number[]{
    const indexAsArray = this.transformTo36bitString(index).split("");
    mask.split("").forEach((bit, index) => {
      if(bit !== "0"){
        indexAsArray[index] = bit;
      }
    });
    return this.processFloatingBits([indexAsArray.join("")]).map(index => Number.parseInt(index, 2));
  }

  public executeBlocks(blocks: ProgramBlock[]) {
    blocks.forEach(block => block.instructions.forEach(instruction => {
      const adjustedValue = this.applyMask(block.mask, instruction.value);
      this.memory.set(instruction.index, adjustedValue);
    }));
  }

  public executeBlocksWithFloatingBits(blocks: ProgramBlock[]) {
    blocks.forEach(block => block.instructions.forEach(instruction => {
      const indexes = this.generateAddresses(block.mask, instruction.index);  
      indexes.forEach(index => this.memory.set(index, instruction.value));
    }));
  }

  public getSumOfMemoryValues() : number {
    let sum = 0;
    this.memory.forEach(value => sum += value);
    return sum;
  }
}

@Injectable()
export class Day14Service implements Processor{
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService
      .readFileAsString('./input/day14.txt')
      .split('\n');

    const programBlocks = this.convertToBlocks(fileContent);
    return `Part 01 [${this.getMemoryValueAfterExecution(programBlocks)}] Part 02 [${this.getMemoryValueAfterExecutionFloatingBits(programBlocks)}]`;
  }

  getMemoryValueAfterExecution(programBlocks: ProgramBlock[]) : number {
    const programExecution = new ProgramExecution();
    programExecution.executeBlocks(programBlocks);
    return programExecution.getSumOfMemoryValues();
  }

  getMemoryValueAfterExecutionFloatingBits(programBlocks: ProgramBlock[]) : number {
    const programExecution = new ProgramExecution();
    programExecution.executeBlocksWithFloatingBits(programBlocks);
    return programExecution.getSumOfMemoryValues();
  }

  convertToBlocks(input: string[]) : ProgramBlock[] {
    const programBlocks = [];
    let currentBlock = null;
    input.forEach(line => {
      if(line.startsWith("mask")) {
        currentBlock = { 
          mask: line.slice(7),
          instructions: []
        };
        programBlocks.push(currentBlock);
      } else {
        const index = Number.parseInt(line.match(/\[[0-9]*\]/g)[0].replace("[", "").replace("]", ""));
        const value = Number.parseInt(line.split('=')[1]);
        currentBlock.instructions.push({index: index, value: value})
      }
    }); 
    return programBlocks;
  }


}

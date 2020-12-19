import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/18

abstract class Evaluator {
  evaluate(tokens: string[]) : number {
    const stack = new Array<Array<string>>();
    let stackTop = new Array<string>();
    stack[0] = stackTop;
    for (let index = 0; index < tokens.length; index++) {
      const element = tokens[index];
      switch (element) {
        case "(":
          stackTop = [];
          stack.push(stackTop);          
          break;
        case ")":
          const parenthesisEval = this.evaluateSimpleExpression(stack.pop());
          stackTop = stack[stack.length - 1];
          stackTop.push(parenthesisEval.toString());
          break;
        default:
          stackTop.push(element);
          break;
      }
    }

    return this.evaluateSimpleExpression(stackTop);
  }

  abstract evaluateSimpleExpression(input: string[]) : number;
}

class LeftToRightEvaluator extends Evaluator {
  evaluateSimpleExpression(input: string[]) : number{
    if(input.length < 3) {
      return 0;
    }
    const rightValue = Number.parseInt(input[input.length - 1]);
    const operator = input[input.length - 2];
    const leftValue = input.length === 3? Number.parseInt(input[0]) : this.evaluateSimpleExpression(input.slice(0, input.length - 2));

    const result = operator === "+" ? rightValue + leftValue : rightValue * leftValue;
    return result;
  }
}

class AdditionBeforeMultiplicationEvaluator extends Evaluator {
  evaluateSimpleExpression(input: string[]) : number{
    if(!input.includes("+")) {
      return new LeftToRightEvaluator().evaluateSimpleExpression(input);
    }

    const indexOfOperator = input.indexOf("+");
    const result = Number.parseInt(input[indexOfOperator-1]) + Number.parseInt(input[indexOfOperator+1]);
    
    if(input.length === 3) return result;

    let remainingExpression = new Array<string>();
    if(indexOfOperator - 2 > 0) {
      remainingExpression = remainingExpression.concat(input.slice(0, indexOfOperator - 1));
    }

    remainingExpression.push(result.toString());

    if(indexOfOperator + 2 < input.length){
      remainingExpression = remainingExpression.concat(input.slice(indexOfOperator + 2, input.length));
    }
    return this.evaluateSimpleExpression(remainingExpression);
  }
}

@Injectable()
export class Day18Service implements Processor{
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService
      .readFileAsString('./input/day18.txt')
      .split('\n');

    return `Part 01 [${this.getSumOfResultsLeftToRight(fileContent)}] Part 02 [${this.getSumOfResultsAdditionBeforeMultiplication(fileContent)}]`;
  }

  getSumOfResultsLeftToRight(fileContent: string[]) : BigInt {
    return fileContent.map(line => BigInt(new LeftToRightEvaluator().evaluate(line.replace(/ /g,"").split("")))).reduce((a, b) => a + b );
  }

  getSumOfResultsAdditionBeforeMultiplication(fileContent: string[]) : BigInt {
    return fileContent.map(line => BigInt(new AdditionBeforeMultiplicationEvaluator().evaluate(line.replace(/ /g,"").split("")))).reduce((a, b) => a + b );
  }

}

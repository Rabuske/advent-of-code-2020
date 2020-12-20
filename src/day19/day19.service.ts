import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const GrammarGraph = require('grammar-graph');

// https://adventofcode.com/2020/day/19

@Injectable()
export class Day19Service implements Processor{
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService
      .readFileAsString('./input/day19.txt')
      .split('\n');

    const parsedInput = this.parseInput(fileContent);
    const updatedGrammar = [...parsedInput[0]];
    updatedGrammar["8"] = ["42", "42 8"];
    updatedGrammar["11"] = ["42 31", "42 11 31"];

    return `Part 01 [${this.countMatchingMessages(parsedInput[0], parsedInput[1])}] Part 02 [${this.countMatchingMessages(updatedGrammar, parsedInput[1])}]`;
  }

  parseInput(input: string[]) : [any, string[]] {
    const grammar = {};
    let index = 0;
    for (index = 0; index < input.length; index++) {
      if(input[index].length <= 1) break;
      const ruleNumberAndContent = input[index].split(":");
      const ruleNumber = ruleNumberAndContent[0];
      const ruleContent = ruleNumberAndContent[1].replace(/\"/g, "").split("|").map(content => content.trim());
      grammar[ruleNumber] = ruleContent;
    }

    // The separation by spaces is necessary due to a limitation on the CFG library
    const messages = input.slice(index + 1, input.length).map(text => text.split("").join(" "));
    return [grammar, messages];
  }

  countMatchingMessages(grammar, messages: string[]) : number {
    const graph = new GrammarGraph(grammar);
    const recognizer = graph.createRecognizer('0');
    return messages.filter(message => recognizer.isComplete(message)).length;
  }
  
}

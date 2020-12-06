import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/6

interface Group {
  answers:string[];
}

@Injectable()
export class Day06Service {
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService.readFileAsString('./input/day06.txt').split("\n");
    const groups = this.convertToGroups(fileContent);    

    return `Part 01 [${this.countDistinctAnswers(groups)}] Part 02 []`;
  }

  convertToGroups(input: string[]) : Group[]{
    const groups = new Array<Group>();
    let group = <Group>{ answers : []};

    input.forEach(line => {
      if(!line || line.length === 0){
        groups.push(group);
        group = { answers : []};
      } else {
        group.answers.push(line); 
      }    
    })
    return groups;
  }

  countDistinctAnswers(groups : Group[]) : number {
    const answerPerGroup =  groups.map(group => [...group.answers.join("")].reduce(
      (uniqueAnswer, character) => { 
        uniqueAnswer.set(character, uniqueAnswer[character]? uniqueAnswer[character] + 1 : 1);
        return uniqueAnswer;
      }, new Map<string, number>())
    ); 
    return answerPerGroup.map(answers => answers.size).reduce((a, b) => a + b);
  }

}

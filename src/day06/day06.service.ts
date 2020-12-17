import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/6

interface Group {
  answers:string[];
  groupedAnswers?: Map<string, number>;
  numberOfParticipants: number;
}

@Injectable()
export class Day06Service implements Processor{
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService.readFileAsString('./input/day06.txt').split("\n");
    const groups = this.convertToGroups(fileContent);    

    return `Part 01 [${this.countDistinctAnswers(groups)}] Part 02 [${this.countAnswersEveryoneAgrees(groups)}]`;
  }

  convertToGroups(input: string[]) : Group[]{
    const groups = new Array<Group>();
    let group = <Group>{ answers : [], numberOfParticipants: 0};

    input.forEach(line => {
      if(!line || line.length === 0){
        group.groupedAnswers = this.groupAnswers(group.answers);
        groups.push(group);
        group = { answers : [], numberOfParticipants : 0};
      } else {
        group.answers.push(line); 
        group.numberOfParticipants++;
      }    
    })
    return groups;
  }

  groupAnswers(answers : string[]) : Map<string, number> {
    return [...answers.join("")].reduce(
      (uniqueAnswer, character) => { 
        uniqueAnswer.set(character, uniqueAnswer.has(character)? uniqueAnswer.get(character) + 1 : 1);
        return uniqueAnswer;
    }, new Map<string, number>());
  }

  countDistinctAnswers(groups : Group[]) : number { 
    return groups.map(group => group.groupedAnswers.size).reduce((a, b) => a + b);
  }

  countAnswersEveryoneAgrees(groups : Group[]) : number {
    return groups.map(group => {
      let numberOfAgreedAnswers = 0;
      group.groupedAnswers.forEach((value) => {
        numberOfAgreedAnswers += value === group.numberOfParticipants? 1 : 0;
      });
      return numberOfAgreedAnswers;
    }).reduce((a, b) => a + b);
  }

}

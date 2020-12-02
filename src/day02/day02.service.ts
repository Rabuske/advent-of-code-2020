import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/1

interface PolicyAndPassword {
  lowerRange: number;
  higherRange: number;
  checkChar: string;
  password: string;
}

@Injectable()
export class Day02Service {
  constructor(private readonly fileReaderService: FileReaderService) {}
  
  processInput(): string {
    const fileContent =  this.fileReaderService.readFileAsString("./input/day02.txt");
    const passwords = fileContent.split("\n").map(line => this.convertLineToPassword(line));
    return passwords.filter(password => this.doesPasswordFollowPolicy(password)).length.toString();

  }

  doesPasswordFollowPolicy(password: PolicyAndPassword) : boolean {
    const numberOfTimesCharAppears = password.password.split("").filter(char => char === password.checkChar).length;
    return password.lowerRange <= numberOfTimesCharAppears && numberOfTimesCharAppears <= password.higherRange;
  }

  convertLineToPassword(line: string) : PolicyAndPassword {
    const [firstNumber, remainingLine]  = line.split("-");
    const [secondNumber, charPlusComma, password] = remainingLine.split(" ");
    return {
      lowerRange : Number.parseInt(firstNumber),
      higherRange: Number.parseInt(secondNumber),
      checkChar: charPlusComma.charAt(0),
      password: password
    }
  }


}

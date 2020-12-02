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
    const part01 = passwords.filter(password => this.doesPasswordFollowPolicy01(password)).length.toString();
    const part02 = passwords.filter(password => this.doesPasswordFollowPolicy02(password)).length.toString();
    return `Part 01 [${part01}] Part 02 [${part02}]`;
  }

  doesPasswordFollowPolicy01(password: PolicyAndPassword) : boolean {
    const numberOfTimesCharAppears = password.password.split("").filter(char => char === password.checkChar).length;
    return password.lowerRange <= numberOfTimesCharAppears && numberOfTimesCharAppears <= password.higherRange;
  }

  doesPasswordFollowPolicy02(password: PolicyAndPassword) : boolean {
    return (password.password.charAt(password.lowerRange - 1) === password.checkChar) !== // This acts as a XOR between the two booleans
           (password.password.charAt(password.higherRange - 1) === password.checkChar);
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

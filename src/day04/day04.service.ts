import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';
import Passport from './Passport';

// https://adventofcode.com/2020/day/4

@Injectable()
export class Day04Service {
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService.readFileAsString('./input/day04.txt');

    const passports = this.convertToPassports(fileContent.split("\n"));

    return `Part 01 [${passports.filter(passport => passport.hasAllFields()).length}] Part 02 [${passports.filter(passport => passport.isPassportValid()).length}]`
  }

  convertToPassports(lines: string[]) : Passport[] {
    let fields = new Map<string, string>();
    const passports = new Array<Passport>();
    lines.forEach(line => {
      if(line.length === 0){
        passports.push(new Passport(fields));
        fields = new Map<string, string>();
      } else {
        const fieldPairs = line.split(' ');
        fieldPairs.forEach(fieldPair => {
          const [key, value] = fieldPair.split(':');
          fields.set(key.trim(), value.trim());
        })
      }      
    });
    if(fields.size > 0) passports.push(new Passport(fields));
    return passports;
  }

}

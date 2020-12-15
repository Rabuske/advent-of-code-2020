import { Controller, Get, Param } from '@nestjs/common';
import { Day01Service } from './day01/day01.service';
import { Day02Service } from './day02/day02.service';
import { Day03Service } from './day03/day03.service';
import { Day04Service } from './day04/day04.service';
import { Day05Service } from './day05/day05.service';
import { Day06Service } from './day06/day06.service';
import { Day07Service } from './day07/day07.service';
import { Day08Service } from './day08/day08.service';
import { Day09Service } from './day09/day09.service';
import { Day10Service } from './day10/day10.service';
import { Day11Service } from './day11/day11.service';
import { Day12Service } from './day12/day12.service';
import { Day13Service } from './day13/day13.service';

@Controller('day')
export class AppController {
  constructor(private readonly day01Service: Day01Service,
              private readonly day02Service: Day02Service,
              private readonly day03Service: Day03Service,
              private readonly day04Service: Day04Service,
              private readonly day05Service: Day05Service,
              private readonly day06Service: Day06Service,
              private readonly day07Service: Day07Service,
              private readonly day08Service: Day08Service,
              private readonly day09Service: Day09Service,
              private readonly day10Service: Day10Service,
              private readonly day11Service: Day11Service,
              private readonly day12Service: Day12Service,
              private readonly day13Service: Day13Service,
            ) {}

  @Get(':id')
  dayNth(@Param() params): string {
    // Ideally I would dynamically instantiate a class, all following the same interface, but it is not worth for now
    switch(Number.parseInt(params.id)){
        case 1: 
          return this.day01Service.processInput();        
        case 2: 
          return this.day02Service.processInput();
        case 3:
          return this.day03Service.processInput();
        case 4:
          return this.day04Service.processInput();  
        case 5:
          return this.day05Service.processInput();    
        case 6:
          return this.day06Service.processInput();      
        case 7:
          return this.day07Service.processInput();
        case 8:
          return this.day08Service.processInput();
        case 9:
          return this.day09Service.processInput();
        case 10:
          return this.day10Service.processInput();
        case 11:
          return this.day11Service.processInput();
        case 12:
          return this.day12Service.processInput();
        case 13:
          return this.day13Service.processInput();
        default: 
          return "Day not valid yet";
    }
    
  }
}

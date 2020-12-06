import { Controller, Get, Param } from '@nestjs/common';
import { Day01Service } from './day01/day01.service';
import { Day02Service } from './day02/day02.service';
import { Day03Service } from './day03/day03.service';
import { Day04Service } from './day04/day04.service';
import { Day05Service } from './day05/day05.service';

@Controller('day')
export class AppController {
  constructor(private readonly day01Service: Day01Service,
              private readonly day02Service: Day02Service,
              private readonly day03Service: Day03Service,
              private readonly day04Service: Day04Service,
              private readonly day05Service: Day05Service
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
        default: 
          return "Day not valid yet";
    }
    
  }
}

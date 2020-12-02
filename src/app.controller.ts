import { Controller, Get, Param } from '@nestjs/common';
import { Day01Service } from './day01/day01.service';
import { Day02Service } from './day02/day02.service';

@Controller('day')
export class AppController {
  constructor(private readonly day01Service: Day01Service,
              private readonly day02Service: Day02Service) {}

  @Get(':id')
  dayNth(@Param() params): string {
    // Ideally I would dynamically instantiate a class, all following the same interface, but it is not worth for now
    switch(Number.parseInt(params.id)){
        case 1: 
            return this.day01Service.processInput();        
        case 2: 
            return this.day02Service.processInput();
        default: 
            return "Day not valid yet";
    }
    
  }
}

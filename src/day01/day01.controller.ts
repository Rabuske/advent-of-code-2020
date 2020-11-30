import { Controller, Get } from '@nestjs/common';
import { Day01Service } from './day01.service';

@Controller('day01')
export class Day01Controller {
  constructor(private readonly day01Service: Day01Service) {}

  @Get()
  day01(): string {
    return this.day01Service.processInput();
  }
}

import { Controller, Get } from '@nestjs/common';
import { Day02Service } from './day02.service';

@Controller('day02')
export class Day02Controller {
  constructor(private readonly day01Service: Day02Service) {}

  @Get()
  day02(): string {
    return this.day01Service.processInput();
  }
}

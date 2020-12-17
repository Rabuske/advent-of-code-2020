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
import { Day14Service } from './day14/day14.service';
import { Day15Service } from './day15/day15.service';
import { Day16Service } from './day16/day16.service';
import { Day17Service } from './day17/day17.service';

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
              private readonly day14Service: Day14Service,
              private readonly day15Service: Day15Service,
              private readonly day16Service: Day16Service,
              private readonly day17Service: Day17Service,
            ) {}

  @Get(':id')
  dayNth(@Param() params): string {
    // Ideally I would dynamically instantiate a class, all following the same interface, but it is not worth for now
    const dayServices = new Map<number, Processor>([
      [ 1, this.day01Service],
      [ 2, this.day02Service],
      [ 3, this.day03Service],
      [ 4, this.day04Service],
      [ 5, this.day05Service],
      [ 6, this.day06Service],
      [ 7, this.day07Service],
      [ 8, this.day08Service],
      [ 9, this.day09Service],
      [10, this.day10Service],
      [11, this.day11Service],
      [12, this.day12Service],
      [13, this.day13Service],
      [14, this.day14Service],
      [15, this.day15Service],
      [16, this.day16Service],
      [17, this.day17Service],
    ]);

    const day = Number.parseInt(params.id);
    return dayServices.has(day)? dayServices.get(day).processInput() : "Day not implemented yet";
  }
}

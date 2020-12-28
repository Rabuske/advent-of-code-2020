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
import { Day18Service } from './day18/day18.service';
import { Day19Service } from './day19/day19.service';
import { Day20Service } from './day20/day20.service';
import { Day21Service } from './day21/day21.service';
import { Day22Service } from './day22/day22.service';
import { Day23Service } from './day23/day23.service';
import { Day24Service } from './day24/day24.service';

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
              private readonly day18Service: Day18Service,
              private readonly day19Service: Day19Service,
              private readonly day20Service: Day20Service,
              private readonly day21Service: Day21Service,
              private readonly day22Service: Day22Service,
              private readonly day23Service: Day23Service,
              private readonly day24Service: Day24Service,
            ) {}

  @Get(':id')
  dayNth(@Param() params): string {

    const serviceName = `day${("0" + params.id).slice(-2)}Service`;
    if(!Object.keys(this).includes(serviceName)) return "Day not implemented yet";
    return this[serviceName].processInput();
  }
}

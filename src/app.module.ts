import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
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
import { FileReaderService } from './utils/fileReader.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    FileReaderService,
    Day01Service,
    Day02Service,
    Day03Service,
    Day04Service,
    Day05Service,
    Day06Service,
    Day07Service,
    Day08Service,
    Day09Service,
    Day10Service,
    Day11Service,
    Day12Service,
    Day13Service,
    Day14Service,
    Day15Service,
    Day16Service,
    Day17Service,
    Day18Service,
    Day19Service,
  ],
})
export class AppModule {}

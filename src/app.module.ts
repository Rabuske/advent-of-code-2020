import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { Day01Service } from './day01/day01.service';
import { Day02Service } from './day02/day02.service';
import { Day03Service } from './day03/day03.service';
import { Day04Service } from './day04/day04.service';
import { Day05Service } from './day05/day05.service';
import { Day06Service } from './day06/day06.service';
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
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { Day01Controller } from './day01/day01.controller';
import { Day01Service } from './day01/day01.service';
import { Day02Controller } from './day02/day02.controller';
import { Day02Service } from './day02/day02.service';
import { FileReaderService } from './utils/fileReader.service';

@Module({
  imports: [],
  controllers: [Day01Controller, Day02Controller],
  providers: [FileReaderService, Day01Service, Day02Service],
})
export class AppModule {}

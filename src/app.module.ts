import { Module } from '@nestjs/common';
import { Day01Controller } from './day01/day01.controller';
import { Day01Service } from './day01/day01.service';
import { FileReaderService } from './utils/fileReader.service';

@Module({
  imports: [],
  controllers: [Day01Controller],
  providers: [FileReaderService, Day01Service],
})
export class AppModule {}

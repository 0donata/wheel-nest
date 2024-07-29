import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Segment } from '../entities/segment.entity';
import { SegmentController } from './segment.controller';
import { SegmentService } from './segment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Segment])],
  providers: [SegmentService],
  controllers: [SegmentController],
})
export class SegmentModule {}

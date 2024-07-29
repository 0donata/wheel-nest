import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Segment } from '../entities/segment.entity';
import { SegmentService } from './segment.service';

@Controller('segments')
export class SegmentController {
  constructor(private readonly segmentService: SegmentService) {}

  @Get()
  findAll(): Promise<Segment[]> {
    return this.segmentService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async updateAll(@Body() segments: Partial<Segment>[]) {
    await this.segmentService.updateAll(segments);
    return { message: 'Segments updated' };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Segment } from '../entities/segment.entity';

@Injectable()
export class SegmentService {
  constructor(
    @InjectRepository(Segment)
    private readonly segmentRepository: Repository<Segment>,
  ) {}

  findAll(): Promise<Segment[]> {
    return this.segmentRepository.find();
  }

  create(segment: Partial<Segment>): Promise<Segment> {
    const newSegment = this.segmentRepository.create(segment);
    return this.segmentRepository.save(newSegment);
  }

  async updateAll(segments: Partial<Segment>[]): Promise<void> {
    await this.segmentRepository.clear();
    await this.segmentRepository.save(segments);
  }
}

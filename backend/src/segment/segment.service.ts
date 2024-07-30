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
    await this.segmentRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.query(
          'DELETE FROM `second_wheel_prizes`',
        );
        await transactionalEntityManager.query('DELETE FROM `segments`');
        await transactionalEntityManager.save(Segment, segments);
      },
    );
  }
}

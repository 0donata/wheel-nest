import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SecondWheelPrize } from 'src/entities/second-wheel-prize.entity';
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

  async updateAll(segments: Partial<Segment>[]): Promise<void> {
    await this.segmentRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.query(
          'DELETE FROM second_wheel_prizes',
        );
        await transactionalEntityManager.query('DELETE FROM segments');

        // Insert new segments
        for (const segment of segments) {
          const segmentEntity = transactionalEntityManager.create(
            Segment,
            segment,
          );
          await transactionalEntityManager.save(Segment, segmentEntity);

          // Handle associated secondWheelPrizes
          if (segment.secondWheelPrizes) {
            for (const prize of segment.secondWheelPrizes) {
              const newPrize = transactionalEntityManager.create(
                SecondWheelPrize,
                {
                  ...prize,
                  segment: segmentEntity,
                },
              );
              await transactionalEntityManager.save(SecondWheelPrize, newPrize);
            }
          }
        }
      },
    );
  }
}

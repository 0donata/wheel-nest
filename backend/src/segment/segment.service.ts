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
        for (const segment of segments) {
          let segmentEntity: Segment;

          // Check if the segment exists
          if (segment.id) {
            // Using findOne with an ID directly
            segmentEntity = await transactionalEntityManager.findOne(Segment, {
              where: { id: segment.id },
            });
            if (!segmentEntity) {
              throw new Error(`Segment with ID ${segment.id} not found`);
            }
            // Ensure segment has all necessary properties before merging
            segmentEntity = transactionalEntityManager.merge(
              Segment,
              segmentEntity,
              segment as Segment,
            );
          } else {
            // Create a new segment if no ID is provided
            segmentEntity = transactionalEntityManager.create(Segment, segment);
          }

          // Save the segment entity
          await transactionalEntityManager.save(Segment, segmentEntity);

          // Handling associated secondWheelPrizes
          if (segment.secondWheelPrizes) {
            // Clear existing prizes
            const existingPrizes = await transactionalEntityManager.find(
              SecondWheelPrize,
              { where: { segment: segmentEntity } },
            );
            await transactionalEntityManager.remove(
              SecondWheelPrize,
              existingPrizes,
            );

            // Create new prizes
            for (const prize of segment.secondWheelPrizes) {
              const newPrize = transactionalEntityManager.create(
                SecondWheelPrize,
                { ...prize, segment: segmentEntity },
              );
              await transactionalEntityManager.save(SecondWheelPrize, newPrize);
            }
          }
        }
      },
    );
  }
}

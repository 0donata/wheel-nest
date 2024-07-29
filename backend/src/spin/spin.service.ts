import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Segment } from '../entities/segment.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class SpinService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Segment)
    private readonly segmentRepository: Repository<Segment>,
  ) {}

  async spinWheel(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user || user.spins <= 0) {
      throw new Error('Not enough spins or user not found');
    }

    const segments = await this.segmentRepository.find();
    if (!segments || segments.length === 0) {
      throw new Error('No segments available');
    }

    const validSegments = segments.filter((segment) => segment.weight >= 0);
    if (validSegments.length === 0) {
      throw new Error('No valid segments available');
    }

    // First wheel spin logic
    const totalWeight = validSegments.reduce(
      (sum, segment) => sum + Math.max(segment.weight, 0),
      0,
    );
    let random = Math.random() * totalWeight;
    let firstWheelPrize = null;

    for (const segment of validSegments) {
      random -= Math.max(segment.weight, 0);
      if (random <= 0) {
        firstWheelPrize = segment;
        break;
      }
    }

    user.spins -= 1;

    if (firstWheelPrize.specialType === 'Try again') {
      await this.userRepository.save(user);
      return {
        firstWheelPrize: {
          name: firstWheelPrize.name,
          weight: firstWheelPrize.weight,
          specialType: firstWheelPrize.specialType,
          secondWheelPrizes: [],
        },
        secondWheelPrize: null,
      };
    }

    let secondWheelPrize = null;
    const secondWheelPrizes = firstWheelPrize.secondWheelPrizes || [];

    if (firstWheelPrize.specialType === 'Free spin') {
      secondWheelPrize = secondWheelPrizes[0];
      user.spins += +secondWheelPrize.name;
    } else if (secondWheelPrizes.length > 0) {
      const totalWeightSecond = secondWheelPrizes.reduce(
        (sum, prize) => sum + Math.max(prize.weight, 0),
        0,
      );
      random = Math.random() * totalWeightSecond;

      for (const prize of secondWheelPrizes) {
        random -= Math.max(prize.weight, 0);
        if (random <= 0) {
          secondWheelPrize = prize;
          break;
        }
      }

      const currentBalance = user.balance[firstWheelPrize.name] || 0;
      user.balance[firstWheelPrize.name] =
        currentBalance + +secondWheelPrize.name;
    }

    await this.userRepository.save(user);

    return {
      firstWheelPrize: {
        name: firstWheelPrize.name,
        weight: firstWheelPrize.weight,
        specialType: firstWheelPrize.specialType,
        secondWheelPrizes: secondWheelPrizes,
      },
      secondWheelPrize: secondWheelPrize
        ? {
            name: secondWheelPrize.name,
            weight: secondWheelPrize.weight,
          }
        : null,
    };
  }
}

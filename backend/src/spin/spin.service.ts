import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Balance } from 'src/entities/balances.entity';
import { UserBalance } from 'src/entities/user-balance.entity';
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
    @InjectRepository(UserBalance)
    private readonly userBalanceRepository: Repository<UserBalance>,
    @InjectRepository(Balance)
    private readonly balanceRepository: Repository<Balance>,
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

    const totalWeight = validSegments.reduce(
      (sum, segment) => sum + segment.weight,
      0,
    );
    let random = Math.random() * totalWeight;
    let firstWheelPrize = null;

    for (const segment of validSegments) {
      random -= segment.weight;
      if (random <= 0) {
        firstWheelPrize = segment;
        break;
      }
    }

    user.spins -= 1;

    if (firstWheelPrize.specialType === 'Try again') {
      await this.userRepository.save(user);
      return { firstWheelPrize, secondWheelPrize: null };
    }

    let secondWheelPrize = null;
    const secondWheelPrizes = firstWheelPrize.secondWheelPrizes || [];

    if (secondWheelPrizes.length > 0) {
      const totalWeightSecond = secondWheelPrizes.reduce(
        (sum, prize) => sum + prize.weight,
        0,
      );
      random = Math.random() * totalWeightSecond;

      for (const prize of secondWheelPrizes) {
        random -= prize.weight;
        if (random <= 0) {
          secondWheelPrize = prize;
          break;
        }
      }
    }

    if (secondWheelPrize) {
      const balance = await this.balanceRepository.findOne({
        where: { name: firstWheelPrize.specialType },
      });

      if (balance) {
        let userBalance = await this.userBalanceRepository.findOne({
          where: { user: { id: user.id }, balance: { id: balance.id } },
        });

        const prizeAmount = parseFloat(secondWheelPrize.name);
        console.log('Before update:', userBalance.amount);

        if (!userBalance) {
          userBalance = this.userBalanceRepository.create({
            user,
            balance,
            amount: prizeAmount,
          });
        } else {
          const currentAmount = parseFloat(
            userBalance.amount as unknown as string,
          );
          userBalance.amount = currentAmount + prizeAmount;
        }

        console.log('After update:', userBalance.amount);

        await this.userBalanceRepository.save(userBalance);
      }
    }

    await this.userRepository.save(user);

    return { firstWheelPrize, secondWheelPrize };
  }
}

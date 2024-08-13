import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Segment } from '../entities/segment.entity';
import { Token } from '../entities/tokens.entity';
import { User } from '../entities/user.entity';
import { Wallet } from '../entities/wallets.entity';

@Injectable()
export class SpinService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Segment)
    private readonly segmentRepository: Repository<Segment>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
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
    const totalWeight = validSegments.reduce(
      (sum, segment) => sum + segment.weight,
      0,
    );

    let random = Math.random() * totalWeight;
    let selectedSegment = null;

    for (const segment of validSegments) {
      random -= segment.weight;
      if (random <= 0) {
        selectedSegment = segment;
        break;
      }
    }

    user.spins -= 1;

    if (selectedSegment.specialType === 'Try again') {
      await this.userRepository.save(user);
      return { firstWheelPrize: selectedSegment, secondWheelPrize: null };
    }

    let secondWheelPrize = null;
    const secondWheelPrizes = selectedSegment.secondWheelPrizes || [];

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

    if (secondWheelPrize && selectedSegment.specialType === 'Token') {
      const prizeAmount = parseFloat(secondWheelPrize.name);
      user.balance += prizeAmount;
    } else if (secondWheelPrize) {
      if (selectedSegment.specialType === 'Free spin') {
        user.spins += parseFloat(secondWheelPrize.name);
      }
      let userBalance = await this.walletRepository.findOne({
        where: {
          user: { id: user.id },
          token: { name: selectedSegment.specialType },
        },
        relations: ['token'],
      });

      const prizeAmount = parseFloat(secondWheelPrize.name);
      const token = await this.tokenRepository.findOne({
        where: { name: selectedSegment.specialType },
      });
      if (!userBalance) {
        userBalance = this.walletRepository.create({
          user,
          token,
          amount: 0,
        });
      }

      userBalance.amount += prizeAmount;

      await this.walletRepository.save(userBalance);
    }

    await this.userRepository.save(user);
    return { firstWheelPrize: selectedSegment, secondWheelPrize };
  }
}

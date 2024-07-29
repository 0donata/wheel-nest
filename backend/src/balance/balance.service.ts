import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Balance } from 'src/entities/balances.entity';
import { Repository } from 'typeorm';
import { UserBalance } from '../entities/user-balance.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(UserBalance)
    private readonly userBalanceRepository: Repository<UserBalance>,
    @InjectRepository(Balance)
    private readonly balanceRepository: Repository<Balance>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getBalance(userId: number) {
    const userBalances = await this.userBalanceRepository.find({
      where: { user: { id: userId } },
      relations: ['balance'],
    });
    return userBalances.map((userBalance) => ({
      balanceId: userBalance.balance.id,
      balanceName: userBalance.balance.name,
      amount: userBalance.amount,
    }));
  }

  async updateBalance(userId: number, balanceId: number, amount: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const balance = await this.balanceRepository.findOne({
      where: { id: balanceId },
    });
    if (!balance) {
      throw new Error('Balance type not found');
    }

    let userBalance = await this.userBalanceRepository.findOne({
      where: { user: { id: userId }, balance: { id: balanceId } },
      relations: ['balance'],
    });
    if (!userBalance) {
      userBalance = this.userBalanceRepository.create({
        user,
        balance,
        amount,
      });
    } else {
      userBalance.amount += amount;
    }
    await this.userBalanceRepository.save(userBalance);

    return {
      balanceId: userBalance.balance.id,
      balanceName: userBalance.balance.name,
      amount: userBalance.amount,
    };
  }
}

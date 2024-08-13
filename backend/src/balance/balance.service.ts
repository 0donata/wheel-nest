import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../entities/tokens.entity';
import { User } from '../entities/user.entity';
import { Wallet } from '../entities/wallets.entity';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Token[]> {
    return this.tokenRepository.find();
  }

  async getBalance(userId: number) {
    const tokens = await this.tokenRepository.find();
    const wallets = await this.walletRepository.find({
      where: { user: { id: userId } },
      relations: ['token'],
    });

    const walletMap = wallets.reduce((acc, wallet) => {
      if (wallet.token) {
        acc[wallet.token.name] = wallet.amount;
      }
      return acc;
    }, {});

    const result = tokens.reduce((acc, token) => {
      acc[token.name] = walletMap[token.name] || 0;
      return acc;
    }, {});

    return result;
  }

  async updateBalance(userId: number, tokenId: number, amount: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const token = await this.tokenRepository.findOne({
      where: { id: tokenId },
    });
    if (!token) {
      throw new Error('Token not found');
    }

    let wallet = await this.walletRepository.findOne({
      where: { user: { id: userId }, token: { id: tokenId } },
      relations: ['token'],
    });

    if (!wallet) {
      wallet = this.walletRepository.create({
        user,
        token,
        amount,
      });
    } else {
      wallet.amount += amount;
    }

    await this.walletRepository.save(wallet);

    return {
      tokenId: wallet.token.id,
      tokenName: wallet.token.name,
      amount: wallet.amount,
    };
  }
}

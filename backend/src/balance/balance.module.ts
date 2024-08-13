import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/entities/tokens.entity';
import { User } from '../entities/user.entity';
import { Wallet } from '../entities/wallets.entity';
import { BalanceController, BalancesController } from './balance.controller';
import { BalanceService } from './balance.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wallet, Token])],
  controllers: [BalanceController, BalancesController],
  providers: [BalanceService],
})
export class BalanceModule {}

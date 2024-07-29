import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from 'src/entities/balances.entity';
import { UserBalance } from '../entities/user-balance.entity';
import { User } from '../entities/user.entity';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserBalance, Balance])],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule {}

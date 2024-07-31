import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from '../entities/balances.entity';
import { Segment } from '../entities/segment.entity';
import { UserBalance } from '../entities/user-balance.entity';
import { User } from '../entities/user.entity';
import { SpinController } from './spin.controller';
import { SpinService } from './spin.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Segment, UserBalance, Balance])],
  providers: [SpinService],
  controllers: [SpinController],
})
export class SpinModule {}

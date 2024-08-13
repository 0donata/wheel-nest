import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/entities/tokens.entity';
import { Wallet } from 'src/entities/wallets.entity';
import { Segment } from '../entities/segment.entity';
import { User } from '../entities/user.entity';
import { SpinController } from './spin.controller';
import { SpinService } from './spin.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Segment, Wallet, Token])],
  providers: [SpinService],
  controllers: [SpinController],
})
export class SpinModule {}

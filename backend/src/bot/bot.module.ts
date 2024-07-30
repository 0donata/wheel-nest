import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { TelegramService } from './bot.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User])],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class BotModule {}

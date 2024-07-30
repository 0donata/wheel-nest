import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { BalanceModule } from './balance/balance.module';
import { BotModule } from './bot/bot.module';
import { AuthUser } from './entities/auth-user.entity';
import { Balance } from './entities/balances.entity';
import { SecondWheelPrize } from './entities/second-wheel-prize.entity';
import { Segment } from './entities/segment.entity';
import { UserBalance } from './entities/user-balance.entity';
import { User } from './entities/user.entity';
import { SegmentModule } from './segment/segment.module';
import { SpinModule } from './spin/spin.module';
import { UserModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        Segment,
        SecondWheelPrize,
        AuthUser,
        UserBalance,
        Balance,
      ],
      synchronize: false,
      logging: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../frontend/dist'),
    }),
    UserModule,
    SegmentModule,
    SpinModule,
    BalanceModule,
    AuthModule,
    BotModule,
  ],
})
export class AppModule {}

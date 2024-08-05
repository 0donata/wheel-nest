import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Balance } from './balances.entity';
import { User } from './user.entity';

@Entity('user_balances')
export class UserBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => User, (user) => user.userBalances)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Balance, (balance) => balance.userBalances)
  @JoinColumn({ name: 'balance_id' })
  balance: Balance;
}

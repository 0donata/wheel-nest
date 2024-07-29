import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Balance } from './balances.entity';
import { User } from './user.entity';

@Entity('user_balances')
export class UserBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @ManyToOne(() => User, (user) => user.userBalances)
  user: User;

  @ManyToOne(() => Balance, (balance) => balance.userBalances)
  balance: Balance;
}

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserBalance } from './user-balance.entity';

@Entity('balances')
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => UserBalance, (userBalance) => userBalance.balance)
  userBalances: UserBalance[];
}

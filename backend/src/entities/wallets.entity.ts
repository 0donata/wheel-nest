import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Token } from './tokens.entity';
import { User } from './user.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.wallets)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Token, (token) => token.wallets)
  @JoinColumn({ name: 'token_id' })
  token: Token;

  @Column({ type: 'float' })
  amount: number;

  @Column()
  status: number;

  @Column()
  time: Date;
}

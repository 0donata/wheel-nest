import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Wallet } from './wallets.entity';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  status: number;

  @OneToMany(() => Wallet, (wallet) => wallet.token)
  wallets: Wallet[];
}

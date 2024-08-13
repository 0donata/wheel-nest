import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Wallet } from './wallets.entity';

@Entity('users')
export class User {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column()
  username: string;

  @Column({ name: 'register_date' })
  registerDate: Date;

  @Column({ name: 'last_activity' })
  lastActivity: Date;

  @Column({ name: 'refer_id', nullable: true })
  referId?: string;

  @Column()
  energy: number;

  @Column({ name: 'energy_limit' })
  energyLimit: number;

  @Column({ name: 'is_admin' })
  isAdmin: number;

  @Column()
  language: number;

  @Column()
  balance: number;

  @Column()
  planet: number;

  @Column()
  level: number;

  @Column()
  xp: number;

  @Column({ name: 'xp_to_next' })
  xpToNext: number;

  @Column({ name: 'refer_count' })
  referCount: number;

  @Column({ name: 'time_energy' })
  timeEnergy: Date;

  @Column({ name: 'subscribe_channel' })
  subscribeChannel: number;

  @Column({ default: 1 })
  spins: number;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];
}

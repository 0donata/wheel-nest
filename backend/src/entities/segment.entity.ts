import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SecondWheelPrize } from './second-wheel-prize.entity';

@Entity('segments')
export class Segment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  weight: number;

  @Column({
    type: 'enum',
    enum: ['Lose', 'Free spin', 'Tether', 'Token'],
    default: 'Lose',
  })
  specialType: string;

  @Column({ type: 'float', default: 1 })
  conversionRate: number;

  @OneToMany(() => SecondWheelPrize, (prize) => prize.segment, {
    cascade: true,
    eager: true,
  })
  secondWheelPrizes: SecondWheelPrize[];
}

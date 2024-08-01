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

  @Column()
  specialType: string;

  @OneToMany(() => SecondWheelPrize, (prize) => prize.segment, {
    cascade: true,
    eager: true,
  })
  secondWheelPrizes: SecondWheelPrize[];
}
